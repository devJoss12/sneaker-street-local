import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../services/catalogo.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CarritoService } from '../services/carrito.service';
import { FooterComponent } from '../footer/footer.component';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  url_imagen: string;
  stock: number;
}

@Component({
  standalone: true,
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',  
  imports: [CommonModule, HttpClientModule, FooterComponent],
  providers: [CatalogoService],
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  productosComprados: Set<number> = new Set();
  cantidadCarrito: number = 0;
  mostrarPopup: boolean = false;

  constructor(
    private catalogoService: CatalogoService, 
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.catalogoService.getCatalogo().subscribe((data) => {
      this.productos = data;
      console.log('Productos y sus stocks:', this.productos.map(p => ({
        nombre: p.nombre,
        stock: p.stock
      })));
    });
  }

  tieneStock(producto: Producto): boolean {
    return producto.stock !== null && producto.stock !== undefined && producto.stock > 0;
  }

  getButtonBackground(producto: Producto): string {
    if (this.esProductoComprado(producto.id)) {
      return 'gray';
    }
    if (!this.tieneStock(producto)) {
      return '#6c757d';
    }
    return 'linear-gradient(45deg, #ff3366, #ff6b3d)';
  }

  getButtonCursor(producto: Producto): string {
    if (this.esProductoComprado(producto.id) || !this.tieneStock(producto)) {
      return 'not-allowed';
    }
    return 'pointer';
  }

  getButtonText(producto: Producto): string {
    if (this.esProductoComprado(producto.id)) {
      return 'Agregado';
    }
    if (!this.tieneStock(producto)) {
      return 'No Disponible';
    }
    return 'Agregar';
  }

  agregarAlCarrito(producto: Producto) {
    if (!this.tieneStock(producto)) {
      return;
    }
    this.carritoService.addToCart(producto);
    this.productosComprados.add(producto.id);
    this.cantidadCarrito = this.carritoService.getItems().length;
    this.mostrarPopupCarrito();
  }

  esProductoComprado(id: number): boolean {
    return this.productosComprados.has(id);
  }

  mostrarPopupCarrito() {
    this.mostrarPopup = true;
    setTimeout(() => {
      this.mostrarPopup = false;
    }, 2000);
  }
}