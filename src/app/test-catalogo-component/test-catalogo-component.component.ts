import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../services/catalogo.service';

@Component({
  standalone: true,
  selector: 'app-test-catalogo',
  template: `
    <h2>Test de Catálogo</h2>
    <div *ngIf="productos.length > 0">
      <p>Catálogo cargado con éxito</p>
    </div>
  `,
  imports: [HttpClientModule, CommonModule],  // Asegúrate de importar HttpClientModule
})
export class TestCatalogoComponent implements OnInit {
  productos: any[] = [];

  constructor(private catalogoService: CatalogoService) {}

  ngOnInit() {
    this.catalogoService.getCatalogo().subscribe(data => {
      this.productos = data;
      console.log('Productos cargados:', this.productos);
    });
  }
}
