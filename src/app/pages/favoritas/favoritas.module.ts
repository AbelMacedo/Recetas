import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritasPageRoutingModule } from './favoritas-routing.module';

import { FavoritasPage } from './favoritas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritasPageRoutingModule
  ],
  declarations: [FavoritasPage]
})
export class FavoritasPageModule {}
