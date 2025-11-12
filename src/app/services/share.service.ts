import { Injectable } from '@angular/core';
import { Share } from '@capacitor/share';
import { Receta } from '../models/receta.model';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }

  async compartirReceta(receta: Receta): Promise<void> {
    try {
      let texto = `🍽️ ${receta.nombre}\n\n`;

      if (receta.descripcion) {
        texto += `📝 ${receta.descripcion}\n\n`;
      }

      texto += `📍 Región: ${receta.region}\n`;
      texto += `🍴 Categoría: ${receta.categoria}\n\n`;

      if (receta.ingredientes && receta.ingredientes.length > 0) {
        texto += `🛒 Ingredientes:\n`;
        receta.ingredientes.forEach((ing, index) => {
          texto += `${index + 1}. ${ing}\n`;
        });
        texto += `\n`;
      }

      if (receta.pasos && receta.pasos.length > 0) {
        texto += `👨‍🍳 Preparación:\n`;
        receta.pasos.forEach((paso, index) => {
          texto += `${index + 1}. ${paso}\n`;
        });
      }

      await Share.share({
        title: receta.nombre,
        text: texto,
        dialogTitle: 'Compartir receta'
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  }
}
