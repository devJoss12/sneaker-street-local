import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Stripe | null = null;
  private readonly stripePublicKey = 'pk_test_51QF9fJ2LbbVNJuW3ZEwkDigj2VHu1ptbe1Efi5rGMLdBdG4pi1oV2EVsF9IhgvUizTzu5hMiZEGhoxnqjGPDlqER00u9Vjb4oa';

  constructor() {
    this.initializeStripe();
  }

  private async initializeStripe() {
    try {
      console.log('Inicializando Stripe...');
      this.stripe = await loadStripe(this.stripePublicKey);
      if (!this.stripe) {
        console.error('No se pudo inicializar Stripe.');
      } else {
        console.log('Stripe inicializado correctamente');
      }
    } catch (error) {
      console.error('Error al inicializar Stripe:', error);
    }
  }
  

  getStripe(): Promise<Stripe | null> {
    if (this.stripe) {
      return Promise.resolve(this.stripe);
    } else {
      return loadStripe(this.stripePublicKey);
    }
  }
}
