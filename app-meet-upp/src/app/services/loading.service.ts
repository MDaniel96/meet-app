import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingAnimationService {

  loading: HTMLIonLoadingElement;
  isLoading: boolean = false;

  constructor(
    private loadingCtrl: LoadingController
  ) { }

  async presentLoading(message: string) {
    if (this.isLoading === false) {
      this.isLoading = true;
      this.loading = await this.loadingCtrl.create({
        duration: 10000,
        message: message,
      });
      await this.loading.present();
    }
  }

  async dismissLoading() {
    this.isLoading = false;
    await this.loading.dismiss();
  }

}
