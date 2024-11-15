// header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  handleImageError(event: any) {
    const target = event.target as HTMLImageElement;
    if (target && target.parentElement) {
      const initial = target.alt.charAt(0).toUpperCase();
      const defaultAvatar = document.createElement('div');
      defaultAvatar.className = 'default-avatar profile-pic';
      defaultAvatar.textContent = initial;
      target.parentElement.replaceChild(defaultAvatar, target);
    }
  }
}