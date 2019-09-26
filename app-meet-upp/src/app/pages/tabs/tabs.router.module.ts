import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { SearchPage } from '../search/search.page';
import { SettingsPage } from '../settings/settings.page';
import { FriendsPage } from '../friends/friends.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'friends',
        children: [
          {
            path: '',
            component: FriendsPage
          }
        ]
      },
      {
        path: 'search',
        component: SearchPage
      },
      {
        path: 'settings',
        component: SettingsPage
      },
      {
        path: '',
        redirectTo: '/tabs/friends',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/friends',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
