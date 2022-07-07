import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MessageModule {

  constructor(private toastCtrl: ToastController) {}

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      'message': message,
      'duration': 4000,
      'position': 'bottom',
      'color': 'warning'
    });
    toast.present();
  }

}
