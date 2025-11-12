import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Receta, Region } from 'backend/src/models/receta.model';
import { RegionLabels } from 'src/app/models/receta.model';
import { RecetaService } from 'src/app/services/receta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  recetasRecientes: Receta[] = [];
  recetasFavoritas: Receta[] = [];
  regiones = Object.values(Region);
  regionLabels = RegionLabels;

  constructor(
    private recetaService: RecetaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Cargar recetas recientes
    this.recetaService.obtenerTodasRecetas().subscribe({
      next: (recetas) => {
        this.recetasRecientes = recetas.slice(0, 5);
      },
      error: (error) => console.error('Error al cargar recetas:', error)
    });

    // Cargar favoritas
    this.recetaService.obtenerFavoritas().subscribe({
      next: (recetas) => {
        this.recetasFavoritas = recetas.slice(0, 5);
      },
      error: (error) => console.error('Error al cargar favoritas:', error)
    });
  }

  verReceta(id: number) {
    this.router.navigate(['/receta', id]);
  }

  verPorRegion(region: Region) {
    this.router.navigate(['/recetas'], { queryParams: { region } });
  }

  irACrear() {
    this.router.navigate(['/crear-receta']);
  }

  irATradicionaleS() {
    this.router.navigate(['/tradicionales']);
  }

  irAFavoritas() {
    this.router.navigate(['/favoritas']);
  }

  irABuscar() {
    this.router.navigate(['/buscar']);
  }
}
