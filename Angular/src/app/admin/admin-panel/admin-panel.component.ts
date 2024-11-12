import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  constructor(private router: Router) {}

  gestionarInventario() {
    this.router.navigate(['/admin/inventario']);
  }

  gestionarUsuarios() {
    this.router.navigate(['/admin/usuarios']);
  }

  isRoute(route: string): boolean {
    return this.router.url === route;
  }
}