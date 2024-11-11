import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { CarritoComponent } from './carrito/carrito.component';
import { LoginComponent } from './login/login.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { AvisoPrivacidadComponent } from './aviso-privacidad/aviso-privacidad.component';
import { InventarioComponent } from './inventario/inventario.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Página principal
  { path: 'login', component: LoginComponent },
  { path: 'catalogo', component: CatalogoComponent },  // Página de catálogo
  { path: 'carrito', component: CarritoComponent },  // Página del carrito
  { path: 'login', component: LoginComponent },
  { path: 'terminos', component: TerminosCondicionesComponent },
  { path: 'aviso', component: AvisoPrivacidadComponent },
  { path: 'inventario', component: InventarioComponent },
];
