import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StripeService } from '../services/stripe.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  imports: [HeaderComponent, CommonModule, HttpClientModule]
})
export class CarritoComponent implements OnInit, AfterViewChecked {
  items: any[] = [];
  total: number = 0;
  mostrarFormulario: boolean = false; // Mostrar u ocultar el formulario de pago
  private stripe: any;
  private card: any;

  constructor(
    private carritoService: CarritoService,
    private stripeService: StripeService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.items = this.carritoService.getItems();
    this.total = this.carritoService.getTotal();
    
    // Inicializa Stripe
    try {
      console.log('Inicializando Stripe...');
      this.stripe = await this.stripeService.getStripe();
      if (!this.stripe) {
        console.error('Stripe no se ha inicializado');
      } else {
        console.log('Stripe inicializado correctamente');
      }
    } catch (error) {
      console.error('Error al obtener Stripe:', error);
    }
  }

  ngAfterViewChecked(): void {
    // Configura el elemento de la tarjeta si el formulario está visible y aún no se ha montado el elemento
    if (this.mostrarFormulario && !this.card) {
      this.configurarElementoStripe();
    }
  }

  eliminarProducto(index: number) {
    this.carritoService.removeFromCart(index);
    this.items = this.carritoService.getItems(); // Actualizar la lista de productos
    this.total = this.carritoService.getTotal(); // Actualizar el total
  }

  mostrarFormularioPago() {
    this.mostrarFormulario = true;
  }

  async configurarElementoStripe() {
    if (!this.stripe) {
      console.error('Stripe no se ha inicializado');
      return;
    }
  
    if (!document.querySelector('#card-element')) {
      console.error('El elemento #card-element no se encontró en el DOM.');
      return;
    }
  
    const elements = this.stripe.elements();
  
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
  
    this.card = elements.create('card', {
      style: style,
      hidePostalCode: false // Mostrar campo postal
    });
  
    this.card.mount('#card-element');
    console.log('Elemento de tarjeta montado correctamente');
  }
  

  async procesarPago(event: Event) {
    event.preventDefault();
  
    if (!this.stripe) {
      console.error('Stripe no se ha inicializado');
      return;
    }
  
    if (!this.card) {
      console.error('No se pudo obtener el elemento de la tarjeta');
      return;
    }
  
    const { token, error } = await this.stripe.createToken(this.card);
    if (error) {
      console.error('Error al crear el token', error);
    } else {
      console.log('Token creado:', token);
      this.http.post('http://localhost:3000/charge', { token, amount: this.total * 100 })
        .subscribe(response => {
          console.log('Pago realizado:', response);
          Swal.fire({
            title: '¡Pago realizado con éxito!',
            text: 'Tu compra ha sido procesada exitosamente. Gracias por comprar con nosotros.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }, error => {
          console.error('Error al procesar el pago:', error);
          Swal.fire({
            title: 'Error al realizar el pago',
            text: 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Reintentar'
          });
        });
    }
  }
}
