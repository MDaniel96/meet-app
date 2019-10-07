import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import { NavController } from '@ionic/angular';
import { SelectedUserService } from 'src/app/services/selected-user.service';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss'],
})
export class FriendItemComponent {

  @Input() friend: User;

  constructor(
    private navCtrl: NavController,
    private selectedUserService: SelectedUserService
  ) { }

  /**
   * If friend is clicked, storing selected user and navigating to user-detail page
   * @param selectedUser clicked user
   */
  selectFriend(selectedUser: User) {
    this.selectedUserService.selectedUser = selectedUser;
    this.navCtrl.navigateForward(`/tabs/friends/${selectedUser.id.toString()}`);
  }

}
