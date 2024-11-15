import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { CarritoComponent } from './carrito/carrito.component';
import { AuthComponent } from './auth/auth.component';  // Cambiamos el import
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { AvisoPrivacidadComponent } from './aviso-privacidad/aviso-privacidad.component';
import { InventarioComponent } from './inventario/inventario.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Página principal
  { path: 'login', component: AuthComponent },  // Cambiamos el componente
  { path: 'auth', component: AuthComponent },
  { 
    path: 'catalogo', 
    component: CatalogoComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'carrito', 
    component: CarritoComponent,
    canActivate: [AuthGuard]
  },
  { path: 'terminos', component: TerminosCondicionesComponent },
  { path: 'aviso', component: AvisoPrivacidadComponent },
  { 
    path: 'admin', 
    component: AdminPanelComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'usuarios',
        pathMatch: 'full'
      },
      {
        path: 'usuarios',
        component: UserManagementComponent
      },
      {
        path: 'inventario',
        component: InventarioComponent
      }
    ]
  },
];