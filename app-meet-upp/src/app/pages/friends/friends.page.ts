import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss']
})
export class FriendsPage {

  user: User;

  constructor(private authService: AuthService) {
    this.user = this.authService.loggedUser;
   }

}
