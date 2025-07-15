import { Routes } from '@angular/router';
import { Listinvoice } from './pages/listinvoice/listinvoice';
import { RoomManagement } from './pages/roommanagement/roommanagement';
import { Layout } from './layout/layout';
import { Login } from './pages/login/login';
import { contractComponent } from './pages/contractsList/contractList';
import { Buildingmanagement } from './pages/buildingmanagement/buildingmanagement';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'invoices', component: Listinvoice },
      { path: 'rooms', component: RoomManagement },
      { path: 'contracts', component: contractComponent },
      { path: 'buildings', component: Buildingmanagement },
    ],
  },
];
