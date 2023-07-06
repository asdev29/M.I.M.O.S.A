import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./list-items-component/list-items-component.component').then((m) => m.ListItemsComponentComponent),
  },
  {
    path: 'add',
    loadComponent: () => import('./add-item/add-item.component').then((m) => m.AddItemComponent),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
