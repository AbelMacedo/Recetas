import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { RecetaService } from '../../services/receta.service';
import { CameraService } from '../../services/camera.service';
import { Receta, Region, Categoria, RegionLabels, CategoriaLabels } from '../../models/receta.model';

@Component({
  selector: 'app-editar-receta',
  templateUrl: './editar-receta.page.html',
  styleUrls: ['./editar-receta.page.scss'],
  standalone: false
})
export class EditarRecetaPage implements OnInit {
  receta: Receta = {
    nombre: '',
    descripcion: '',
    region: Region.CENTRO,
    categoria: Categoria.GUISOS,
    tiempoPreparacion: 30,
    porciones: 4,
    esFavorita: false,
    esTradicional: false,
    notasPersonales: '',
    fotoUrl: '',
    ingredientes: [''],
    pasos: ['']
  };

  recetaId: number = 0;
  regiones = Object.values(Region);
  categorias = Object.values(Categoria);
  regionLabels = RegionLabels;
  categoriaLabels = CategoriaLabels;
  fotoTemporal: string = '';

  constructor(
    private route: ActivatedRoute,
    private recetaService: RecetaService,
    private cameraService: CameraService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recetaId = Number(id);
      this.cargarReceta(this.recetaId);
    }
  }

  cargarReceta(id: number) {
    this.recetaService.obtenerRecetaPorId(id).subscribe({
      next: (receta) => {
        this.receta = receta;
        // Asegurar que tenga al menos un elemento
        if (!this.receta.ingredientes || this.receta.ingredientes.length === 0) {
          this.receta.ingredientes = [''];
        }
        if (!this.receta.pasos || this.receta.pasos.length === 0) {
          this.receta.pasos = [''];
        }
      },
      error: (error) => {
        console.error('Error al cargar receta:', error);
        this.mostrarToast('Error al cargar receta', 'danger');
        this.router.navigate(['/home']);
      }
    });
  }

  agregarIngrediente() {
    this.receta.ingredientes.push('');
  }

  eliminarIngrediente(index: number) {
    if (this.receta.ingredientes.length > 1) {
      this.receta.ingredientes.splice(index, 1);
    }
  }

  agregarPaso() {
    this.receta.pasos.push('');
  }

  eliminarPaso(index: number) {
    if (this.receta.pasos.length > 1) {
      this.receta.pasos.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  async seleccionarFoto() {
    const alert = await this.alertController.create({
      header: 'Seleccionar foto',
      buttons: [
        {
          text: 'Cámara',
          handler: () => {
            this.tomarFoto();
          }
        },
        {
          text: 'Galería',
          handler: () => {
            this.seleccionarDeGaleria();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async tomarFoto() {
    const photo = await this.cameraService.tomarFoto();
    if (photo && photo.webPath) {
      this.fotoTemporal = photo.webPath;
      await this.subirFoto(photo);
    }
  }

  async seleccionarDeGaleria() {
    const photo = await this.cameraService.seleccionarDeGaleria();
    if (photo && photo.webPath) {
      this.fotoTemporal = photo.webPath;
      await this.subirFoto(photo);
    }
  }

  async subirFoto(photo: any) {
    const loading = await this.loadingController.create({
      message: 'Subiendo foto...'
    });
    await loading.present();

    try {
      const file = await this.cameraService.convertirPhotoAFile(photo);
      if (file) {
        this.recetaService.subirFoto(file).subscribe({
          next: (url) => {
            this.receta.fotoUrl = url;
            loading.dismiss();
            this.mostrarToast('Foto actualizada correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al subir foto:', error);
            loading.dismiss();
            this.mostrarToast('Error al subir foto', 'danger');
          }
        });
      }
    } catch (error) {
      loading.dismiss();
      this.mostrarToast('Error al procesar foto', 'danger');
    }
  }

  async guardarCambios() {
    // Validaciones
    if (!this.receta.nombre.trim()) {
      this.mostrarToast('El nombre es requerido', 'warning');
      return;
    }

    // Filtrar ingredientes y pasos vacíos
    this.receta.ingredientes = this.receta.ingredientes.filter(i => i.trim() !== '');
    this.receta.pasos = this.receta.pasos.filter(p => p.trim() !== '');

    if (this.receta.ingredientes.length === 0) {
      this.mostrarToast('Agrega al menos un ingrediente', 'warning');
      return;
    }

    if (this.receta.pasos.length === 0) {
      this.mostrarToast('Agrega al menos un paso', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando cambios...'
    });
    await loading.present();

    this.recetaService.actualizarReceta(this.recetaId, this.receta).subscribe({
      next: (receta) => {
        loading.dismiss();
        this.mostrarToast('Receta actualizada exitosamente', 'success');
        this.router.navigate(['/receta', receta.id]);
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        loading.dismiss();
        this.mostrarToast('Error al actualizar receta', 'danger');
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

  cancelar() {
    this.router.navigate(['/receta', this.recetaId]);
  }
}
