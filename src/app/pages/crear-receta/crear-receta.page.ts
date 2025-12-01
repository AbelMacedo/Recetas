import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { RecetaService } from '../../services/receta.service';
import { CameraService } from '../../services/camera.service';
import { Receta, Region, Categoria, RegionLabels, CategoriaLabels } from '../../models/receta.model';

@Component({
  selector: 'app-crear-receta',
  templateUrl: './crear-receta.page.html',
  styleUrls: ['./crear-receta.page.scss'],
  standalone: false
})
export class CrearRecetaPage {
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

  regiones = Object.values(Region);
  categorias = Object.values(Categoria);
  regionLabels = RegionLabels;
  categoriaLabels = CategoriaLabels;

  fotoTemporal: string = '';

  constructor(
    private recetaService: RecetaService,
    private cameraService: CameraService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

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
    if (photo && photo.base64String) {
      // Guardar base64 directamente
      this.receta.fotoUrl = `data:image/${photo.format};base64,${photo.base64String}`;
      this.fotoTemporal = this.receta.fotoUrl;
      this.mostrarToast('Foto capturada correctamente', 'success');
    }
  }

  async seleccionarDeGaleria() {
    const photo = await this.cameraService.seleccionarDeGaleria();
    if (photo && photo.base64String) {
      // Guardar base64 directamente
      this.receta.fotoUrl = `data:image/${photo.format};base64,${photo.base64String}`;
      this.fotoTemporal = this.receta.fotoUrl;
      this.mostrarToast('Foto seleccionada correctamente', 'success');
    }
  }

  // Ya no necesitamos este método
  async subirFoto(photo: any) {
    // Método obsoleto - ahora usamos base64 directamente
  }

  async guardarReceta() {
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
      message: 'Guardando receta...'
    });
    await loading.present();

    this.recetaService.crearReceta(this.receta).subscribe({
      next: (receta) => {
        loading.dismiss();
        this.mostrarToast('Receta guardada exitosamente', 'success');
        this.router.navigate(['/receta', receta.id]);
      },
      error: (error) => {
        console.error('Error al guardar:', error);
        loading.dismiss();
        this.mostrarToast('Error al guardar receta', 'danger');
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
    this.router.navigate(['/home']);
  }
}
