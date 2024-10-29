import { Component, OnInit } from '@angular/core';
import { StripeService } from '../services/stripe.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private stripeService: StripeService, private http: HttpClient) { }

  ngOnInit(): void {
    this.setupStripe();
  }

  async setupStripe() {
    const stripe = this.stripeService.getStripe();
    if (!stripe) {
      console.error('Stripe no se ha inicializado');
      return;
    }

    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');

    const form = document.getElementById('payment-form') as HTMLFormElement;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const { token, error } = await stripe.createToken(card);
      if (error) {
        console.error('Error al crear el token', error);
      } else {
        console.log('Token creado:', token);
        this.http.post('http://localhost:3000/charge', { token })
          .subscribe(response => {
            console.log('Pago realizado:', response);
          }, error => {
            console.error('Error al procesar el pago:', error);
          });
      }
    });
  }
}
