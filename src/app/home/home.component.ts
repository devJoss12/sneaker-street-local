import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <app-header></app-header>

    <section class="main-banner" style="margin-top: 120px;">
      <div class="image-container" style="width: 100%; max-width: 2000px; overflow: hidden;">
        <img 
          src="https://jdesblog.s3.amazonaws.com/wp-content/uploads/2020/07/Blog_Header_1920x840-%E2%80%93-2.jpg" 
          alt="Sneakers" 
          style="width: 100% !important; max-height: 800px !important; object-fit: contain !important; display: block !important;">
      </div>
    </section>


    <div class="home-container">
      <h1>Bienvenido a Sneaker Street Local</h1>
      <p>Explora nuestra colección exclusiva de sneakers o revisa tu carrito de compras.</p>
    </div>
  `,
  imports: [HeaderComponent]
})
export class HomeComponent { }
