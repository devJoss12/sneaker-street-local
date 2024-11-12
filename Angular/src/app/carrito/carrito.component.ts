import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StripeService } from '../services/stripe.service';
import { StockService } from '../services/stock.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  imports: [HeaderComponent, CommonModule, HttpClientModule, FooterComponent]
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
    private stockService: StockService,
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
      Swal.fire({
        title: 'Error en el pago',
        text: 'Error al procesar la tarjeta. Por favor, verifica los datos.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } else {
      console.log('Token creado:', token);
      
      // Preparar las actualizaciones de stock
      const stockUpdates = this.stockService.prepareStockUpdates(this.items);

      // Procesar el pago
      this.http.post('http://localhost:3000/charge', { token, amount: this.total * 100 })
        .subscribe(
          async (response) => {
            try {
              // Actualizar el stock después del pago exitoso
              await this.stockService.updateStock(stockUpdates).toPromise();

              // Mostrar mensaje de éxito
              await Swal.fire({
                title: '¡Pago realizado con éxito!',
                text: 'Tu compra ha sido procesada exitosamente. Gracias por comprar con nosotros.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });

              // Generar recibo XML
              this.generarReciboXML();
              
              // Limpiar el carrito
              this.carritoService.clearCart();
              this.items = [];
              this.total = 0;
              
            } catch (error) {
              console.error('Error al actualizar el stock:', error);
              Swal.fire({
                title: 'Error en el procesamiento',
                text: 'Tu pago fue procesado pero hubo un error al actualizar el inventario. Por favor, contacta con soporte.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error => {
            console.error('Error al procesar el pago:', error);
            Swal.fire({
              title: 'Error al realizar el pago',
              text: 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Reintentar'
            });
          }
        );
    }
  }
  
  generarReciboXML() {
    // Crear un documento XML
    let doc = document.implementation.createDocument('', '', null);
    let recibo = doc.createElement('recibo');
  
    // Añadir la fecha del recibo
    let fecha = doc.createElement('fecha');
    const fechaActual = new Date().toISOString();
    fecha.appendChild(doc.createTextNode(fechaActual));
    recibo.appendChild(fecha);
  
    // Añadir un número de recibo (podríamos generarlo aleatoriamente)
    let numeroRecibo = doc.createElement('numero');
    numeroRecibo.appendChild(doc.createTextNode(Math.floor(Math.random() * 1000000).toString()));
    recibo.appendChild(numeroRecibo);
  
    // Información del comprador
    let comprador = doc.createElement('comprador');
    comprador.appendChild(doc.createTextNode('Cliente de Sneaker Street'));
    recibo.appendChild(comprador);
  
    // Información de los productos
    let productos = doc.createElement('productos');
    this.items.forEach(item => {
      let producto = doc.createElement('producto');
  
      let nombre = doc.createElement('nombre');
      nombre.appendChild(doc.createTextNode(item.nombre));
      producto.appendChild(nombre);
  
      let precio = doc.createElement('precio');
      precio.appendChild(doc.createTextNode(item.precio.toString()));
      producto.appendChild(precio);
  
      let cantidad = doc.createElement('cantidad');
      cantidad.appendChild(doc.createTextNode('1')); // Podrías modificar esto para reflejar cantidades reales
      producto.appendChild(cantidad);
  
      productos.appendChild(producto);
    });
    recibo.appendChild(productos);
  
    // Información del total
    let totalElement = doc.createElement('total');
    totalElement.appendChild(doc.createTextNode(this.total.toString()));
    recibo.appendChild(totalElement);
  
    // Añadir el nodo principal al documento
    doc.appendChild(recibo);
  
    // Convertir el documento XML en texto con indentación
    let serializer = new XMLSerializer();
    let xmlString = serializer.serializeToString(doc);
  
    // Añadir una función para indentar el XML
    const formattedXml = this.formatXML(xmlString);
  
    // Crear un Blob para el archivo XML
    let blob = new Blob([formattedXml], { type: 'application/xml' });
  
    // Crear un enlace para descargar el archivo
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'recibo.xml';
    document.body.appendChild(a);
    a.click();
  
    // Eliminar el enlace después de descargar el archivo
    document.body.removeChild(a);
  }
  
  formatXML(xml: string): string {
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
  
    xml = xml.replace(reg, '$1\r\n$2$3');
    const nodes = xml.split('\r\n');
    let indent = 0;
  
    nodes.forEach(node => {
      let padding = '';
  
      if (node.match(/.+<\/\w[^>]*>$/)) {
        padding = this.getPadding(indent);
      } else if (node.match(/^<\/\w/)) {
        if (indent !== 0) {
          indent -= 1;
        }
        padding = this.getPadding(indent);
      } else if (node.match(/^<\w([^>]*[^/])?>.*$/)) {
        padding = this.getPadding(indent);
        indent += 1;
      } else {
        padding = this.getPadding(indent);
      }
  
      formatted += padding + node + '\r\n';
    });
  
    return formatted;
  }
  
  getPadding(indent: number): string {
    return new Array(indent + 1).join('  ');
  }  
}
