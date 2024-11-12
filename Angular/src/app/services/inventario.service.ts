import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = 'http://localhost/sneaker_street_api/get_inventario.php';

  constructor(private http: HttpClient) {
    console.log('InventarioService constructor');
  }

  getInventario(): Observable<any> {
    console.log('Llamando a getInventario');
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error en la petición:', error);
        throw error;
      })
    );
  }
}