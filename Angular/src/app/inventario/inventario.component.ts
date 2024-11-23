import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InventarioService } from '../services/inventario.service';
import { UploadService } from '../services/upload.service';
import { Producto } from '../models/producto.interface';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  imports: [
    CommonModule, 
    HttpClientModule, 
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [
    InventarioService, 
    UploadService
  ]
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  loading: boolean = true;
  error: string | null = null;
  productoForm: FormGroup;
  modoEdicion: boolean = false;
  productoSeleccionado: Producto | null = null;
  archivoSeleccionado: File | null = null;
  mostrarFormulario: boolean = false;

  constructor(
    private inventarioService: InventarioService,
    private uploadService: UploadService, 
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      imagen: ['']
    });
  }

  mostrarFormularioAgregar() {
    this.modoEdicion = false;
    this.productoSeleccionado = null;
    this.resetForm();
    this.mostrarFormulario = true;
  }


  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario(): void {
    this.loading = true;
    this.inventarioService.getInventario().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar inventario:', err);
        this.error = 'Error al cargar el inventario';
        this.loading = false;
      }
    });
  }

  async onSubmit() {
    if (this.productoForm.valid) {
      try {
        let urlImagen = this.productoSeleccionado?.url_imagen || '';
        
        if (this.archivoSeleccionado) {
          try {
            console.log('Subiendo imagen...');
            urlImagen = await this.uploadService.uploadImage(this.archivoSeleccionado);
            console.log('Imagen subida exitosamente:', urlImagen);
          } catch (error) {
            console.error('Error al subir la imagen:', error);
            this.mostrarError('Error al subir la imagen. Por favor, intenta nuevamente.');
            return;
          }
        }
  
        const productoData: Producto = {
          nombre: this.productoForm.get('nombre')?.value,
          descripcion: this.productoForm.get('descripcion')?.value,
          precio: this.productoForm.get('precio')?.value,
          stock: this.productoForm.get('stock')?.value,
          url_imagen: urlImagen
        };
  
        if (this.modoEdicion && this.productoSeleccionado) {
          productoData.id = this.productoSeleccionado.id;
          this.inventarioService.actualizarProducto(productoData).subscribe({
            next: (response) => {
              this.mostrarMensajeExito('Producto actualizado correctamente');
              this.resetForm();
              this.cargarInventario();
            },
            error: (error) => {
              console.error('Error al actualizar producto:', error);
              this.mostrarError('Error al actualizar el producto');
            }
          });
        } else {
          this.inventarioService.crearProducto(productoData).subscribe({
            next: (response) => {
              this.mostrarMensajeExito('Producto creado correctamente');
              this.resetForm();
              this.cargarInventario();
            },
            error: (error) => {
              console.error('Error al crear producto:', error);
              this.mostrarError('Error al crear el producto');
            }
          });
        }
      } catch (error) {
        console.error('Error en el formulario:', error);
        this.mostrarError('Error al procesar el formulario');
      }
    }
  }
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files?.length) {
      this.archivoSeleccionado = element.files[0];
    }
  }

  editarProducto(producto: Producto) {
    this.modoEdicion = true;
    this.productoSeleccionado = producto;
    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    });
    this.mostrarFormulario = true;
  }

  resetForm() {
    this.productoForm.reset();
    this.modoEdicion = false;
    this.productoSeleccionado = null;
    this.archivoSeleccionado = null;
    this.mostrarFormulario = false;
  }

  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventarioService.eliminarProducto(id).subscribe({
          next: () => {
            this.mostrarMensajeExito('Producto eliminado correctamente');
            this.cargarInventario();
          },
          error: (err) => this.mostrarError('Error al eliminar el producto')
        });
      }
    });
  }

  mostrarMensajeExito(mensaje: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
      timer: 2000
    });
  }

  mostrarError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
  }

  marcarSinStock(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto marcará el producto como sin stock',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar sin stock',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventarioService.marcarSinStock(id).subscribe({
          next: () => {
            this.mostrarMensajeExito('Producto marcado como sin stock');
            this.cargarInventario();
          },
          error: (err) => {
            console.error('Error al marcar sin stock:', err);
            this.mostrarError('Error al marcar el producto sin stock');
          }
        });
      }
    });
  }
}