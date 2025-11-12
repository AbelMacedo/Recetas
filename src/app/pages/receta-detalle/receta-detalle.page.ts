import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { RecetaService } from '../../services/receta.service';
import { ShareService } from '../../services/share.service';
import { Receta, RegionLabels, CategoriaLabels } from '../../models/receta.model';

@Component({
  selector: 'app-receta-detalle',
  templateUrl: './receta-detalle.page.html',
  styleUrls: ['./receta-detalle.page.scss'],
  standalone: false,
})
export class RecetaDetallePage implements OnInit {
  receta: Receta | null = null;
  regionLabels = RegionLabels;
  categoriaLabels = CategoriaLabels;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recetaService: RecetaService,
    private shareService: ShareService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarReceta(Number(id));
    }
  }

  cargarReceta(id: number) {
    this.recetaService.obtenerRecetaPorId(id).subscribe({
      next: (receta) => {
        this.receta = receta;
      },
      error: (error) => {
        console.error('Error al cargar receta:', error);
        this.mostrarToast('Error al cargar receta', 'danger');
        this.router.navigate(['/home']);
      }
    });
  }

  async toggleFavorita() {
    if (!this.receta) return;

    const nuevoEstado = !this.receta.esFavorita;

    this.recetaService.toggleFavorita(this.receta.id!, nuevoEstado).subscribe({
      next: (receta) => {
        this.receta = receta;
        const mensaje = nuevoEstado ? 'Agregada a favoritas' : 'Removida de favoritas';
        this.mostrarToast(mensaje, 'success');
      },
      error: (error) => {
        console.error('Error al actualizar favorita:', error);
        this.mostrarToast('Error al actualizar', 'danger');
      }
    });
  }

  async compartir() {
    if (this.receta) {
      await this.shareService.compartirReceta(this.receta);
    }
  }

  editarReceta() {
    if (this.receta) {
      this.router.navigate(['/editar-receta', this.receta.id]);
    }
  }

  async confirmarEliminar() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta receta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarReceta();
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarReceta() {
    if (!this.receta) return;

    const loading = await this.loadingController.create({
      message: 'Eliminando receta...'
    });
    await loading.present();

    this.recetaService.eliminarReceta(this.receta.id!).subscribe({
      next: () => {
        loading.dismiss();
        this.mostrarToast('Receta eliminada', 'success');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        loading.dismiss();
        this.mostrarToast('Error al eliminar receta', 'danger');
      }
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}
