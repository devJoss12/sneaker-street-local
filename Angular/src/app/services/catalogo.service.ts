import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class CatalogoService {
  private apiUrl = 'http://localhost/sneaker_street_api/get_catalogo.php';

  constructor(private http: HttpClient) { }

  getCatalogo(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}

