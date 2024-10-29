import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../services/catalogo.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CarritoService } from '../services/carrito.service'; // Importamos el servicio del carrito

@Component({
  standalone: true,
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',  
  imports: [CommonModule, HttpClientModule],
  providers: [CatalogoService],
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];
  productosComprados: Set<number> = new Set(); // Guardar los productos comprados por ID

  constructor(private catalogoService: CatalogoService, private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.catalogoService.getCatalogo().subscribe((data) => {
      this.productos = data;
      console.log('Productos cargados desde el servicio:', this.productos);
    });
  }

  agregarAlCarrito(producto: any) {
    this.carritoService.addToCart(producto);
    this.productosComprados.add(producto.id); // Marcar el producto como comprado
    console.log('Producto agregado al carrito:', producto);
  }

  // Método para verificar si un producto ha sido comprado
  esProductoComprado(id: number): boolean {
    return this.productosComprados.has(id);
  }
}
