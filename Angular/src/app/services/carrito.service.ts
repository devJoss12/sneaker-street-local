import { Injectable } from '@angular/core';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  url_imagen: string;
  cantidad: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private items: any[] = [];
  private total: number = 0;

  constructor() {}

  addToCart(product: any) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.cantidad < existingItem.stock) {
        existingItem.cantidad++;
        this.total += parseFloat(product.precio);
      }
    } else {
      const cartItem: CartItem = {
        ...product,
        cantidad: 1
      };
      this.items.push(cartItem);
      this.total += parseFloat(product.precio);
    }
  }

  removeFromCart(index: number) {
    if (index > -1 && index < this.items.length) {
      const item = this.items[index];
      this.total -= parseFloat(item.precio) * item.cantidad;
      this.items.splice(index, 1);
    }
  }

  updateQuantity(index: number, newQuantity: number) {
    if (index > -1 && index < this.items.length) {
      const item = this.items[index];
      if (newQuantity > 0 && newQuantity <= item.stock) {
        const priceDifference = (newQuantity - item.cantidad) * parseFloat(item.precio);
        item.cantidad = newQuantity;
        this.total += priceDifference;
      }
    }
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.total;
  }

  clearCart() {
    this.items = [];
    this.total = 0;
  }
}
