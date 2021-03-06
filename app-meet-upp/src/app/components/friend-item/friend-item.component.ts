import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { fadeInOutAnimation } from 'src/app/config/Animations';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss'],
  animations: [ fadeInOutAnimation ]
})
export class FriendItemComponent {

  @Input() friend: User;

  constructor(
    private navCtrl: NavController,
    private globalService: GlobalService
  ) { }

  /**
   * If friend is clicked, storing selected user and navigating to user-detail page
   * @param selectedUser clicked user
   */
  selectFriend(selectedUser: User) {
    this.globalService.selectedUser = selectedUser;
    this.navCtrl.navigateForward(`/tabs/friends/${selectedUser.id.toString()}`);
  }

}
