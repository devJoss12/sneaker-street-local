import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StripeService } from '../services/stripe.service';
import { StockService } from '../services/stock.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { OrderConfirmationComponent } from '../order-confirmation/order-confirmation.component';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';

@Component({
  standalone: true,
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  imports: [
    HeaderComponent, 
    CommonModule, 
    HttpClientModule, 
    FooterComponent, 
    FormsModule,
    OrderConfirmationComponent
  ]
})
export class CarritoComponent implements OnInit, AfterViewChecked {
  items: any[] = [];
  total: number = 0;
  mostrarFormulario: boolean = false; // Mostrar u ocultar el formulario de pago
  private stripe: any;
  private card: any;
  showConfirmationModal: boolean = false;
  userEmail: string = '';

  constructor(
    private carritoService: CarritoService,
    private stripeService: StripeService,
    private stockService: StockService,
    private emailService: EmailService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.items = this.carritoService.getItems();
    this.total = this.carritoService.getTotal();

    this.authService.isLoggedIn().subscribe(user => {
      if (user && user.email) {
        this.userEmail = user.email;
      }
    });
    
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
    this.items = this.carritoService.getItems();
    this.total = this.carritoService.getTotal();
  }

  actualizarCantidad(index: number, event: any) {
    const newQuantity = parseInt(event.target.value);
    const item = this.items[index];
    
    if (newQuantity <= 0) {
      Swal.fire({
        title: 'Cantidad inválida',
        text: 'La cantidad debe ser mayor a 0',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      event.target.value = item.cantidad;
      return;
    }

    if (newQuantity > item.stock) {
      Swal.fire({
        title: 'Stock insuficiente',
        text: `Solo hay ${item.stock} unidades disponibles`,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      event.target.value = item.cantidad;
      return;
    }

    this.carritoService.updateQuantity(index, newQuantity);
    this.total = this.carritoService.getTotal();
  }

  mostrarFormularioPago() {
    console.log('Mostrando modal de confirmación');
    this.showConfirmationModal = true;
    console.log('Estado del modal:', this.showConfirmationModal);
  }

   // Añadir el método confirmarPedido
   async confirmarPedido() {
    this.showConfirmationModal = false;
    this.mostrarFormulario = true;
    await this.configurarElementoStripe();
  }

  // Añadir el método cancelarConfirmacion
  cancelarConfirmacion() {
    this.showConfirmationModal = false;
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

    try {
      // Verificar stock antes del pago
      const stockAvailable = await this.stockService.checkStockAvailability(this.items).toPromise();
      
      if (!stockAvailable) {
        await Swal.fire({
          title: 'Stock insuficiente',
          text: 'Algunos productos ya no están disponibles en la cantidad solicitada.',
          icon: 'error',
          confirmButtonText: 'Revisar carrito'
        });
        this.cargarProductosActualizados();
        return;
      }

      if (!this.stripe || !this.card) {
        console.error('Stripe no está inicializado correctamente');
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
        return;
      }

      // Preparar actualizaciones de stock
      const stockUpdates = this.stockService.prepareStockUpdates(this.items);

      this.http.post('http://localhost:3000/charge', {
        token,
        amount: this.total * 100
      }).subscribe(
        async (paymentResponse) => {
          try {
            await this.stockService.updateStock(this.stockService.prepareStockUpdates(this.items)).toPromise();
            
            const orderNumber = this.emailService.generateOrderNumber();
            const orderDate = this.emailService.formatDate(new Date());
            const reciboXML = this.generarReciboXML(orderNumber, orderDate);

            console.log('XML generado:', reciboXML); // Verificación

            const orderDetails = {
              orderNumber,
              items: this.items,
              total: this.total,
              userEmail: this.userEmail,
              date: orderDate,
              reciboXML: reciboXML // Aseguramos que el XML se incluye
            };

            // Enviar correo con el XML
            this.emailService.sendOrderConfirmationWithReceipt(orderDetails).subscribe(
              async (response) => {
                console.log('Respuesta del servidor:', response); // Verificación
                
                await Swal.fire({
                  title: '¡Compra exitosa!',
                  html: `
                    <p>Tu pedido ha sido procesado exitosamente.</p>
                    <p>Número de orden: <strong>${orderNumber}</strong></p>
                    <p>Se ha enviado una confirmación y el recibo a tu correo: <strong>${this.userEmail}</strong></p>
                  `,
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                });
                
                // Limpiar carrito
                this.carritoService.clearCart();
                this.items = [];
                this.total = 0;

                // Usar el Router para la navegación
                this.router.navigate(['/catalogo']);
              },
              error => {
                console.error('Error al enviar el correo:', error);
                Swal.fire({
                  title: '¡Compra exitosa!',
                  text: 'Tu pedido se procesó correctamente, pero hubo un problema al enviar el correo de confirmación.',
                  icon: 'warning',
                  confirmButtonText: 'Aceptar'
                });
              }
            );
          } catch (error) {
            console.error('Error en el proceso:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al procesar tu pedido.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        },
        error => {
          console.error('Error en la transacción:', error);
          Swal.fire({
            title: 'Error en la transacción',
            text: 'Hubo un problema al procesar el pago.',
            icon: 'error',
            confirmButtonText: 'Reintentar'
          });
        }
      );
    } catch (error) {
      console.error('Error general:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error inesperado.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  async cargarProductosActualizados() {
    // Actualizar stocks de productos en el carrito
    const productIds = this.items.map(item => item.id);
    try {
      const response = await this.http.post('http://localhost/sneaker_street_api/get_products_stock.php', { ids: productIds }).toPromise();
      const updatedProducts = response as any[];
      
      // Actualizar cantidades si es necesario
      this.items = this.items.map(item => {
        const updatedProduct = updatedProducts.find(p => p.id === item.id);
        if (updatedProduct && item.cantidad > updatedProduct.stock) {
          item.cantidad = updatedProduct.stock;
          // Actualizar el total
          this.carritoService.updateQuantity(this.items.indexOf(item), updatedProduct.stock);
        }
        item.stock = updatedProduct ? updatedProduct.stock : 0;
        return item;
      });
      
      // Filtrar productos sin stock
      this.items = this.items.filter(item => item.stock > 0);
      this.total = this.carritoService.getTotal();
      
      if (this.items.length === 0) {
        await Swal.fire({
          title: 'Carrito vacío',
          text: 'Los productos seleccionados ya no están disponibles.',
          icon: 'info',
          confirmButtonText: 'Ir al catálogo'
        });
        // Redirigir al catálogo
        window.location.href = '/catalogo';
      }
    } catch (error) {
      console.error('Error al actualizar los productos:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la información de los productos.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  
  generarReciboXML(orderNumber: string, orderDate: string): string {
    // Crear un documento XML
    const xmlDoc = document.implementation.createDocument('', '', null);
    
    // Función helper para crear elementos con indentación
    const createElement = (parent: Element, name: string, content?: string, indent: number = 0) => {
        const spaces = '  '.repeat(indent);
        
        // Añadir indentación como texto al elemento padre
        parent.appendChild(xmlDoc.createTextNode('\n' + spaces));
        
        const element = xmlDoc.createElement(name);
        if (content !== undefined) {
            element.appendChild(xmlDoc.createTextNode(content));
        }
        parent.appendChild(element);
        
        return element;
    };
    
    // Crear el elemento raíz
    const recibo = xmlDoc.createElement('recibo');
    xmlDoc.appendChild(recibo);
    
    // Formatear la fecha correctamente
    const formatearFecha = (fechaStr: string) => {
        try {
            // Si la fecha ya viene en formato ISO, la usamos directamente
            if (fechaStr.includes('T')) {
                return fechaStr;
            }
            // Si no, creamos un objeto Date con la fecha actual
            const fecha = new Date();
            return fecha.toISOString();
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return new Date().toISOString(); // Fecha actual como fallback
        }
    };

    const fechaISO = formatearFecha(orderDate);
    createElement(recibo, 'fecha', fechaISO, 1);
    
    // Añadir número de orden
    createElement(recibo, 'numero', orderNumber, 1);
    
    // Añadir información del comprador
    createElement(recibo, 'comprador', this.userEmail, 1);
    
    // Crear sección de productos
    const productos = createElement(recibo, 'productos', undefined, 1);
    
    let subtotalGeneral = 0;
    
    // Añadir cada producto
    this.items.forEach(item => {
        const producto = createElement(productos, 'producto', undefined, 2);
        
        const precioNumerico = parseFloat(item.precio);
        const subtotalValue = precioNumerico * item.cantidad;
        subtotalGeneral += subtotalValue;
        
        createElement(producto, 'nombre', item.nombre, 3);
        createElement(producto, 'precio', precioNumerico.toFixed(2), 3);
        createElement(producto, 'cantidad', item.cantidad.toString(), 3);
        createElement(producto, 'subtotal', subtotalValue.toFixed(2), 3);
        
        // Cerrar producto con indentación
        producto.appendChild(xmlDoc.createTextNode('\n' + '  '.repeat(2)));
    });
    
    // Cerrar productos con indentación
    productos.appendChild(xmlDoc.createTextNode('\n' + '  '));
    
    // Añadir subtotal
    createElement(recibo, 'subtotal', subtotalGeneral.toFixed(2), 1);
    
    // Añadir impuestos (16% IVA)
    const iva = subtotalGeneral * 0.16;
    createElement(recibo, 'impuestos', iva.toFixed(2), 1);
    
    // Añadir total con impuestos
    const totalConImpuestos = subtotalGeneral + iva;
    createElement(recibo, 'total', totalConImpuestos.toFixed(2), 1);
    
    // Cerrar recibo con nueva línea
    recibo.appendChild(xmlDoc.createTextNode('\n'));
    
    // Serializar a string
    const serializer = new XMLSerializer();
    let xmlString = serializer.serializeToString(xmlDoc);
    
    // Añadir declaración XML al inicio
    xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlString;
    
    // Para debug
    console.log('XML generado:', xmlString);
    
    return xmlString;
}

  getPadding(indent: number): string {
    return new Array(indent + 1).join('  ');
  }  
}
