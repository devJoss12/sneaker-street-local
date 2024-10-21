import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../services/catalogo.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',  // Enlace al archivo HTML
  imports: [CommonModule, HttpClientModule],
  providers: [CatalogoService],
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];

  constructor(private catalogoService: CatalogoService) {}

  ngOnInit(): void {
    this.catalogoService.getCatalogo().subscribe((data) => {
      this.productos = data;
      console.log('Productos cargados desde el servicio:', this.productos);
    });
  }
}
