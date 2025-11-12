import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Receta, Region, Categoria } from '../models/receta.model';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = 'http://localhost:3000/api/recetas';

  // BehaviorSubject para actualizar la lista en tiempo real
  private recetasSubject = new BehaviorSubject<Receta[]>([]);
  public recetas$ = this.recetasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarRecetas();
  }

  // Cargar todas las recetas
  cargarRecetas(): void {
    this.obtenerTodasRecetas().subscribe({
      next: (recetas) => this.recetasSubject.next(recetas),
      error: (error) => console.error('Error al cargar recetas:', error)
    });
  }

  // CRUD básico
  obtenerTodasRecetas(): Observable<Receta[]> {
    return this.http.get<ApiResponse<Receta[]>>(this.apiUrl).pipe(
      map(response => response.data || [])
    );
  }

  obtenerRecetaPorId(id: number): Observable<Receta> {
    return this.http.get<ApiResponse<Receta>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data!)
    );
  }

  crearReceta(receta: Receta): Observable<Receta> {
    return this.http.post<ApiResponse<Receta>>(this.apiUrl, receta).pipe(
      map(response => response.data!),
      tap(() => this.cargarRecetas())
    );
  }

  actualizarReceta(id: number, receta: Receta): Observable<Receta> {
    return this.http.put<ApiResponse<Receta>>(`${this.apiUrl}/${id}`, receta).pipe(
      map(response => response.data!),
      tap(() => this.cargarRecetas())
    );
  }

  eliminarReceta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.cargarRecetas())
    );
  }

  // Filtros
  obtenerPorRegion(region: Region): Observable<Receta[]> {
    return this.http.get<ApiResponse<Receta[]>>(`${this.apiUrl}/region/${region}`).pipe(
      map(response => response.data || [])
    );
  }

  obtenerPorCategoria(categoria: Categoria): Observable<Receta[]> {
    return this.http.get<ApiResponse<Receta[]>>(`${this.apiUrl}/categoria/${categoria}`).pipe(
      map(response => response.data || [])
    );
  }

  obtenerFavoritas(): Observable<Receta[]> {
    return this.http.get<ApiResponse<Receta[]>>(`${this.apiUrl}/filtro/favoritas`).pipe(
      map(response => response.data || [])
    );
  }

  obtenerTradicionales(): Observable<Receta[]> {
    return this.http.get<ApiResponse<Receta[]>>(`${this.apiUrl}/filtro/tradicionales`).pipe(
      map(response => response.data || [])
    );
  }

  // Búsqueda
  buscarRecetas(termino: string): Observable<Receta[]> {
    const params = new HttpParams().set('termino', termino);
    return this.http.get<ApiResponse<Receta[]>>(`${this.apiUrl}/buscar/general`, { params }).pipe(
      map(response => response.data || [])
    );
  }

  // Favoritos
  toggleFavorita(id: number, esFavorita: boolean): Observable<Receta> {
    return this.http.patch<ApiResponse<Receta>>(`${this.apiUrl}/${id}/favorita`, { esFavorita }).pipe(
      map(response => response.data!),
      tap(() => this.cargarRecetas())
    );
  }

  // Subir foto
  subirFoto(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('foto', file);

    return this.http.post<ApiResponse<{ fotoUrl: string }>>(`${this.apiUrl}/upload/foto`, formData).pipe(
      map(response => response.data!.fotoUrl)
    );
  }
}
