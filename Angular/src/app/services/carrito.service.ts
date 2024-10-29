import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private items: any[] = [];
  private total: number = 0;

  constructor() {}

  // Método para agregar un producto al carrito
  addToCart(product: any) {
    this.items.push(product);
    this.total += parseFloat(product.precio); // Convertir el precio a número antes de sumar
  }

  // Método para eliminar un producto del carrito
  removeFromCart(index: number) {
    if (index > -1 && index < this.items.length) {
      this.total -= parseFloat(this.items[index].precio); // Restar el precio del producto eliminado
      this.items.splice(index, 1); // Eliminar el producto del array
    }
  }

  // Método para obtener los productos en el carrito
  getItems() {
    return this.items;
  }

  // Método para obtener el total del carrito
  getTotal() {
    return this.total;
  }
}
