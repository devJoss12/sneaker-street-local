import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-carrito',
  template: `
    <app-header></app-header>
    <h2>Carrito de compras</h2>
  `,
  imports: [HeaderComponent]
})
export class CarritoComponent { }
