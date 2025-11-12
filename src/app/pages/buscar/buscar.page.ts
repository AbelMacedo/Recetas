import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecetaService } from '../../services/receta.service';
import { Receta, Region, Categoria, RegionLabels, CategoriaLabels } from '../../models/receta.model';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
  standalone: false
})
export class BuscarPage implements OnInit {
  terminoBusqueda: string = '';
  resultados: Receta[] = [];
  buscando: boolean = false;
  sinResultados: boolean = false;

  // Filtros
  regionSeleccionada: Region | null = null;
  categoriaSeleccionada: Categoria | null = null;

  regiones = Object.values(Region);
  categorias = Object.values(Categoria);
  regionLabels = RegionLabels;
  categoriaLabels = CategoriaLabels;

  constructor(
    private recetaService: RecetaService,
    private router: Router
  ) {}

  ngOnInit() {}

  buscar(event?: any) {
    const termino = event ? event.target.value : this.terminoBusqueda;

    if (!termino || termino.trim().length < 2) {
      this.resultados = [];
      this.sinResultados = false;
      return;
    }

    this.buscando = true;
    this.sinResultados = false;

    this.recetaService.buscarRecetas(termino.trim()).subscribe({
      next: (recetas) => {
        this.resultados = this.aplicarFiltros(recetas);
        this.sinResultados = this.resultados.length === 0;
        this.buscando = false;
      },
      error: (error) => {
        console.error('Error al buscar:', error);
        this.buscando = false;
        this.sinResultados = true;
      }
    });
  }

  aplicarFiltros(recetas: Receta[]): Receta[] {
    let filtradas = [...recetas];

    if (this.regionSeleccionada) {
      filtradas = filtradas.filter(r => r.region === this.regionSeleccionada);
    }

    if (this.categoriaSeleccionada) {
      filtradas = filtradas.filter(r => r.categoria === this.categoriaSeleccionada);
    }

    return filtradas;
  }

  onFiltroChange() {
    if (this.resultados.length > 0 || this.terminoBusqueda.trim().length >= 2) {
      this.buscar();
    }
  }

  limpiarFiltros() {
    this.regionSeleccionada = null;
    this.categoriaSeleccionada = null;
    this.onFiltroChange();
  }

  verReceta(id: number) {
    this.router.navigate(['/receta', id]);
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.resultados = [];
    this.sinResultados = false;
    this.limpiarFiltros();
  }
}
