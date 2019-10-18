import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AppSettings } from '../config/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class LoadingAnimationService {

  loading: HTMLIonLoadingElement;
  isLoading: boolean = false;

  constructor(
    private loadingCtrl: LoadingController
  ) { }

  /**
   * Present loading with message for max 20 secs
   * @param message loading message 
   */
  async presentLoading(message: string) {
    if (this.isLoading === false) {
      this.isLoading = true;
      this.loading = await this.loadingCtrl.create({
        duration: 20000,
        message: message,
        backdropDismiss: AppSettings.LOADING_BACKDROP_DISMISS
      });
      await this.loading.present();
    }
  }

  /**
   * Dismiss loading
   */
  async dismissLoading() {
    this.isLoading = false;
    await this.loading.dismiss();
  }

}
