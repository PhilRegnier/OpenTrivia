import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JeuPageRoutingModule } from './jeu-routing.module';

import { JeuPage } from './jeu.page';
import { ToolsModule } from '../tools/tools.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JeuPageRoutingModule,
    ToolsModule
  ],
  declarations: [JeuPage]
})
export class JeuPageModule {}
