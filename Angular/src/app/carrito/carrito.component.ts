import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  imports: [HeaderComponent, CommonModule]
})
export class CarritoComponent implements OnInit {
  items: any[] = [];
  total: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.items = this.carritoService.getItems();
    this.total = this.carritoService.getTotal();
  }

  eliminarProducto(index: number) {
    this.carritoService.removeFromCart(index);
    this.items = this.carritoService.getItems(); // Actualizar la lista de productos
    this.total = this.carritoService.getTotal(); // Actualizar el total
  }
}
