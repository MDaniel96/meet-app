import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { SearchPage } from '../search/search.page';
import { SettingsPage } from '../settings/settings.page';
import { MainPage } from '../main/main.page';
import { UserDetailsPage } from '../user-details/user-details.page';

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
            component: MainPage
          },
          {
            path: ':id',
            component: UserDetailsPage
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
