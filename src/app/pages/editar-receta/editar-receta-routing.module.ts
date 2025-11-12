import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarRecetaPage } from './editar-receta.page';

const routes: Routes = [
  {
    path: '',
    component: EditarRecetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarRecetaPageRoutingModule {}
