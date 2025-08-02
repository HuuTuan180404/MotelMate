import { Routes } from '@angular/router';
import { Listinvoice } from './pages/listinvoice/listinvoice';
import { RoomManagement } from './pages/roommanagement/roommanagement';
import { Layout } from './layout/layout';
import { Login } from './auth/login/login';
import { Buildingmanagement } from './pages/buildingmanagement/buildingmanagement';
import { ContractComponent } from './pages/contractsList/contractList';
import { TenantManagement } from './pages/tenantmanagement/tenantmanagement';
import { Requests } from './pages/requests/requests';
import { Dashboard } from './pages/dashboard/dashboard';
import { AssetManagement } from './pages/assetmanagement/assetmanagement';
import { Service } from './pages/service/service';
import { AuthGuard } from './auth/auth.guard';
import { AccountTypeSelection } from './auth/register/account-selection/account-type-selection';
import { TenantRegister } from './auth/register/tenant-register/tenant-register';
import { OwnerRegister } from './auth/register/owner-register/owner-register';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login},
  { path: 'register', component: AccountTypeSelection},
  { path: 'register/tenant', component: TenantRegister},
  { path: 'register/owner', component: OwnerRegister},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  // { path: 'register/owner'},
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'invoices', component: Listinvoice },
      { path: 'rooms', component: RoomManagement },
      { path: 'buildings', component: Buildingmanagement },
      { path: 'contracts', component: ContractComponent },
      { path: 'tenants', component: TenantManagement },
      { path: 'requests/payment', component: Requests },
      { path: 'requests/room-registration', component: Requests },
      { path: 'requests/feedbackorissue', component: Requests },
      { path: 'requests/extend-contract', component: Requests },
      { path: 'dashboard', component: Dashboard },
      { path: 'assets', component: AssetManagement },
      { path: 'services', component: Service },
    ],
  },
];
