import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarRecetaPageRoutingModule } from './editar-receta-routing.module';

import { EditarRecetaPage } from './editar-receta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarRecetaPageRoutingModule
  ],
  declarations: [EditarRecetaPage]
})
export class EditarRecetaPageModule {}
