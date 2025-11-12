import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  async tomarFoto(): Promise<Photo | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      return photo;
    } catch (error) {
      console.error('Error al tomar foto:', error);
      return null;
    }
  }

  async seleccionarDeGaleria(): Promise<Photo | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      return photo;
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      return null;
    }
  }

  async convertirPhotoAFile(photo: Photo): Promise<File | null> {
    try {
      if (!photo.webPath) return null;

      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      const fileName = `foto_${Date.now()}.${photo.format}`;
      return new File([blob], fileName, { type: `image/${photo.format}` });
    } catch (error) {
      console.error('Error al convertir foto:', error);
      return null;
    }
  }
}
