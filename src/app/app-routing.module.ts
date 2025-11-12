import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'recetas',
    loadChildren: () => import('./pages/recetas/recetas.module').then(m => m.RecetasPageModule)
  },
  {
    path: 'receta/:id',
    loadChildren: () => import('./pages/receta-detalle/receta-detalle.module').then(m => m.RecetaDetallePageModule)
  },
  {
    path: 'crear-receta',
    loadChildren: () => import('./pages/crear-receta/crear-receta.module').then(m => m.CrearRecetaPageModule)
  },
  {
    path: 'editar-receta/:id',
    loadChildren: () => import('./pages/editar-receta/editar-receta.module').then(m => m.EditarRecetaPageModule)
  },
  {
    path: 'tradicionales',
    loadChildren: () => import('./pages/tradicionales/tradicionales.module').then(m => m.TradicionalesPageModule)
  },
  {
    path: 'favoritas',
    loadChildren: () => import('./pages/favoritas/favoritas.module').then(m => m.FavoritasPageModule)
  },
  {
    path: 'buscar',
    loadChildren: () => import('./pages/buscar/buscar.module').then(m => m.BuscarPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'recetas',
    loadChildren: () => import('./pages/recetas/recetas.module').then( m => m.RecetasPageModule)
  },
  {
    path: 'receta-detalle',
    loadChildren: () => import('./pages/receta-detalle/receta-detalle.module').then( m => m.RecetaDetallePageModule)
  },
  {
    path: 'crear-receta',
    loadChildren: () => import('./pages/crear-receta/crear-receta.module').then( m => m.CrearRecetaPageModule)
  },
  {
    path: 'editar-receta',
    loadChildren: () => import('./pages/editar-receta/editar-receta.module').then( m => m.EditarRecetaPageModule)
  },
  {
    path: 'tradicionales',
    loadChildren: () => import('./pages/tradicionales/tradicionales.module').then( m => m.TradicionalesPageModule)
  },
  {
    path: 'favoritas',
    loadChildren: () => import('./pages/favoritas/favoritas.module').then( m => m.FavoritasPageModule)
  },
  {
    path: 'buscar',
    loadChildren: () => import('./pages/buscar/buscar.module').then( m => m.BuscarPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
