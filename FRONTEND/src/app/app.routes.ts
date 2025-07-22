import { Routes } from '@angular/router';
import { Listinvoice } from './pages/listinvoice/listinvoice';
import { RoomManagement } from './pages/roommanagement/roommanagement';
import { Layout } from './layout/layout';
import { Login } from './pages/login/login';
import { Buildingmanagement } from './pages/buildingmanagement/buildingmanagement';
import { ContractComponent } from './pages/contractsList/contractList';
import { TenantManagement } from './pages/tenantmanagement/tenantmanagement';
import { Paymentrequest } from './pages/paymentrequest/paymentrequest';
import { Dashboard } from './pages/dashboard/dashboard';
import { AssetManagement } from './pages/assetmanagement/assetmanagement';
import { Service } from './pages/service/service';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'invoices', component: Listinvoice },
      { path: 'rooms', component: RoomManagement },
      { path: 'buildings', component: Buildingmanagement },
      { path: 'contracts', component: ContractComponent },
      { path: 'tenants', component: TenantManagement },
      { path: 'requests/payment', component: Paymentrequest },
      { path: 'dashboard', component: Dashboard },
      { path: 'assets', component: AssetManagement },
      { path: 'services', component: Service },
    ],
  },
];
