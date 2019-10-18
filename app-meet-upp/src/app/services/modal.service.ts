import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComponentRef, ComponentProps } from '@ionic/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: HTMLIonModalElement;

  constructor(
    private modalCtrl: ModalController
  ) {
  }

  /**
   * Show modal
   * @param component page to show
   * @param data params to page
   */
  async presentModal(component: ComponentRef, friend: User) {
    this.modal = await this.modalCtrl.create({
      component: component,
      componentProps: {
        'selectedFriend': friend
      },
      cssClass: 'addEventModal'
    });
    return await this.modal.present();
  }

  /**
   * Hiding modal, sending data
   */
  async onDismissed() {
    return await this.modal.onWillDismiss();
  }

}
