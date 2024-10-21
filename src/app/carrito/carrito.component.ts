import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-carrito',
  template: `
    <app-header></app-header>
    
    <section class="carrito-content" style="margin-top: 120px;">
      <h2>Carrito de Compras</h2>
      <!-- Aquí puedes agregar más contenido relacionado al catálogo -->
    </section>
  `,
  imports: [HeaderComponent]
})
export class CarritoComponent { }
