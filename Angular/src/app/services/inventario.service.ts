import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Producto } from '../models/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private baseUrl = 'http://localhost/sneaker_street_api';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
    console.log('InventarioService constructor');
  }

  getInventario(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/get_inventario.php`).pipe(
      catchError(error => {
        console.error('Error en la petición:', error);
        throw error;
      })
    );
  }

  crearProducto(producto: Producto): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/create_producto.php`, 
      producto,
      { headers: this.headers }
    );
  }

  actualizarProducto(producto: Producto): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/update_producto.php`, 
      producto,
      { headers: this.headers }
    );
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete_producto.php`, { id });
  }

  marcarSinStock(id: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/update_stock_status.php`,
      { id },
      { headers: this.headers }
    );
  }
}