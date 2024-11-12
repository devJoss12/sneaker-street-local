import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost/sneaker_street_api/update_stock.php';

  constructor(private http: HttpClient) {}

  updateStock(productUpdates: Array<{id: number, quantity: number}>): Observable<any> {
    return this.http.post<any>(this.apiUrl, { updates: productUpdates }).pipe(
      catchError(error => {
        console.error('Error al actualizar el stock:', error);
        throw error;
      })
    );
  }

  prepareStockUpdates(cartItems: any[]): Array<{id: number, quantity: number}> {
    // Agrupa los items por ID y cuenta las cantidades
    const updates = cartItems.reduce((acc: { [key: string]: number }, item) => {
      const id = item.id;
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    // Convierte el objeto agrupado en un array de actualizaciones
    return Object.entries(updates).map(([id, quantity]) => ({
      id: parseInt(id),
      quantity: quantity
    }));
  }
}