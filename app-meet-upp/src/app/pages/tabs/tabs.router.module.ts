import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { SearchPage } from '../search/search.page';
import { SettingsPage } from '../settings/settings.page';
import { MainPage } from '../main/main.page';
import { UserDetailsPage } from '../user-details/user-details.page';
import { EventsPage } from '../events/events.page';
import { EventCreatePage } from '../event-create/event-create.page';
import { EventDetailPage } from '../event-detail/event-detail.page';

const routes: Routes = [
  {
    path: 'addEvent',
    component: EventCreatePage
  },
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
        path: 'events',
        children: [
          {
            path: '',
            component: EventsPage
          },
          {
            path: ':id',
            component: EventDetailPage
          }
        ]
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
export class TabsPageRoutingModule { }
