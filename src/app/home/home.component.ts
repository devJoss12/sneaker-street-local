import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <app-header></app-header>
    <section class="main-banner">
      <img src="https://jdesblog.s3.amazonaws.com/wp-content/uploads/2020/07/Blog_Header_1920x840-%E2%80%93-2.jpg" alt="Sneakers" class="banner-img">
    </section>
    
    <div class="home-container">
      <h1>Bienvenido a Sneaker Street Local</h1>
      <p>Explora nuestra colección exclusiva de sneakers o revisa tu carrito de compras.</p>
    </div>
  `,
  imports: [HeaderComponent]
})
export class HomeComponent { }
