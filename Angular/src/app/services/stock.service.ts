import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost/sneaker_street_api/update_stock.php';
  private checkStockUrl = 'http://localhost/sneaker_street_api/check_stock.php';

  constructor(private http: HttpClient) {}

  updateStock(productUpdates: Array<{id: number, quantity: number}>): Observable<any> {
    return this.http.post<any>(this.apiUrl, { updates: productUpdates }).pipe(
      catchError(error => {
        console.error('Error al actualizar el stock:', error);
        throw error;
      })
    );
  }

  checkStockAvailability(cartItems: any[]): Observable<boolean> {
    const itemsToCheck = cartItems.map(item => ({
      id: item.id,
      quantity: item.cantidad || 1
    }));

    console.log('Verificando disponibilidad de stock para:', itemsToCheck);

    return this.http.post<any>(this.checkStockUrl, { items: itemsToCheck }).pipe(
      map(response => {
        console.log('Respuesta de verificación de stock:', response);
        return response.available;
      }),
      catchError(error => {
        console.error('Error al verificar el stock:', error);
        throw error;
      })
    );
  }

  prepareStockUpdates(cartItems: any[]): Array<{id: number, quantity: number}> {
    
    return cartItems.map(item => ({
      id: item.id,
      quantity: item.cantidad || 1 
    }));
  }
}