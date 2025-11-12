import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecetaService } from '../../services/receta.service';
import { Receta, RegionLabels, CategoriaLabels } from '../../models/receta.model';

@Component({
  selector: 'app-favoritas',
  templateUrl: './favoritas.page.html',
  styleUrls: ['./favoritas.page.scss'],
  standalone: false
})
export class FavoritasPage implements OnInit {
  recetasFavoritas: Receta[] = [];
  cargando: boolean = true;
  regionLabels = RegionLabels;
  categoriaLabels = CategoriaLabels;

  constructor(
    private recetaService: RecetaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarFavoritas();
  }

  ionViewWillEnter() {
    this.cargarFavoritas();
  }

  cargarFavoritas() {
    this.cargando = true;

    this.recetaService.obtenerFavoritas().subscribe({
      next: (recetas) => {
        this.recetasFavoritas = recetas;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar favoritas:', error);
        this.cargando = false;
      }
    });
  }

  verReceta(id: number) {
    this.router.navigate(['/receta', id]);
  }

  irABuscar() {
    this.router.navigate(['/buscar']);
  }
}
