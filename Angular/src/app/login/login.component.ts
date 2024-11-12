// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;

  constructor(private authService: AuthService) {}

  async loginWithGoogle() {
    try {
      this.isLoading = true;
      await this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Error en login:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      this.isLoading = false;
    }
  }
}