import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InventarioService } from '../services/inventario.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  imports: [CommonModule, HttpClientModule, HeaderComponent, FooterComponent],
  providers: [InventarioService]
})

export class InventarioComponent implements OnInit {
  productos: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private inventarioService: InventarioService) {
    console.log('Constructor de InventarioComponent');
  }

  ngOnInit(): void {
    console.log('ngOnInit de InventarioComponent');
    this.cargarInventario();
  }

  cargarInventario(): void {
    console.log('Iniciando carga de inventario');
    this.loading = true;
    this.inventarioService.getInventario().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
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
}