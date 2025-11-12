import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradicionalesPageRoutingModule } from './tradicionales-routing.module';

import { TradicionalesPage } from './tradicionales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradicionalesPageRoutingModule
  ],
  declarations: [TradicionalesPage]
})
export class TradicionalesPageModule {}
