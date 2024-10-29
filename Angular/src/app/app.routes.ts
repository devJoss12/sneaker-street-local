import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { CarritoComponent } from './carrito/carrito.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Página principal
  { path: 'login', component: LoginComponent },
  { path: 'catalogo', component: CatalogoComponent },  // Página de catálogo
  { path: 'carrito', component: CarritoComponent },  // Página del carrito
];
