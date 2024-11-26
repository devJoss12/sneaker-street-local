import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface OrderDetails {
  orderNumber: string;
  items: any[];
  total: number;
  userEmail: string;
  date: string;
  reciboXML?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  sendOrderConfirmationWithReceipt(orderDetails: OrderDetails): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-order-confirmation`, orderDetails);
  }

  generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${random}`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}