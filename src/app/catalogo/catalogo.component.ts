import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-catalogo',
  template: `
    <app-header></app-header>
    <div class="content">
      <h1>Catálogo de sneakers</h1>
      <p>Aquí verás todos los sneakers disponibles.</p>
    </div>
  `,
  imports: [HeaderComponent]
})
export class CatalogoComponent { }
