import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetaService } from '../../services/receta.service';
import { Receta, Region, Categoria, RegionLabels, CategoriaLabels } from '../../models/receta.model';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
  standalone: false
})
export class RecetasPage implements OnInit {
  recetas: Receta[] = [];
  recetasFiltradas: Receta[] = [];
  cargando: boolean = true;

  // Filtros
  regionSeleccionada: Region | null = null;
  categoriaSeleccionada: Categoria | null = null;

  regiones = Object.values(Region);
  categorias = Object.values(Categoria);
  regionLabels = RegionLabels;
  categoriaLabels = CategoriaLabels;

  constructor(
    private recetaService: RecetaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener filtros de query params si existen
    this.route.queryParams.subscribe(params => {
      if (params['region']) {
        this.regionSeleccionada = params['region'] as Region;
      }
      if (params['categoria']) {
        this.categoriaSeleccionada = params['categoria'] as Categoria;
      }
      this.cargarRecetas();
    });
  }

  ionViewWillEnter() {
    this.cargarRecetas();
  }

  cargarRecetas() {
    this.cargando = true;

    this.recetaService.obtenerTodasRecetas().subscribe({
      next: (recetas) => {
        this.recetas = recetas;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar recetas:', error);
        this.cargando = false;
      }
    });
  }

  aplicarFiltros() {
    let filtradas = [...this.recetas];

    if (this.regionSeleccionada) {
      filtradas = filtradas.filter(r => r.region === this.regionSeleccionada);
    }

    if (this.categoriaSeleccionada) {
      filtradas = filtradas.filter(r => r.categoria === this.categoriaSeleccionada);
    }

    this.recetasFiltradas = filtradas;
  }

  onFiltroChange() {
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.regionSeleccionada = null;
    this.categoriaSeleccionada = null;
    this.aplicarFiltros();
  }

  verReceta(id: number) {
    this.router.navigate(['/receta', id]);
  }

  irACrear() {
    this.router.navigate(['/crear-receta']);
  }
}
