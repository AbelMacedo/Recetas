import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecetaService } from '../../services/receta.service';
import { Receta, Region, RegionLabels, CategoriaLabels } from '../../models/receta.model';

@Component({
  selector: 'app-tradicionales',
  templateUrl: './tradicionales.page.html',
  styleUrls: ['./tradicionales.page.scss'],
  standalone: false
})
export class TradicionalesPage implements OnInit {
  recetasPorRegion: Map<Region, Receta[]> = new Map();
  cargando: boolean = true;
  regiones = Object.values(Region);
  regionLabels = RegionLabels;
  categoriaLabels = CategoriaLabels;

  constructor(
    private recetaService: RecetaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarTradicionales();
  }

  ionViewWillEnter() {
    this.cargarTradicionales();
  }

  cargarTradicionales() {
    this.cargando = true;

    this.recetaService.obtenerTradicionales().subscribe({
      next: (recetas) => {
        this.organizarPorRegion(recetas);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar tradicionales:', error);
        this.cargando = false;
      }
    });
  }

  organizarPorRegion(recetas: Receta[]) {
    this.recetasPorRegion.clear();

    this.regiones.forEach(region => {
      const recetasRegion = recetas.filter(r => r.region === region);
      if (recetasRegion.length > 0) {
        this.recetasPorRegion.set(region, recetasRegion);
      }
    });
  }

  verReceta(id: number) {
    this.router.navigate(['/receta', id]);
  }

  getRegionesConRecetas(): Region[] {
    return Array.from(this.recetasPorRegion.keys());
  }

  getRecetasPorRegion(region: Region): Receta[] {
    return this.recetasPorRegion.get(region) || [];
  }
}
