import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isRegistering: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  async login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }
    try {
      this.isLoading = true;
      this.errorMessage = '';
      await this.authService.loginWithEmail(this.email, this.password);
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  async register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }
    try {
      this.isLoading = true;
      this.errorMessage = '';
      await this.authService.registerWithEmail(this.email, this.password);
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle() {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      await this.authService.loginWithGoogle();
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  async forgotPassword() {
    if (!this.email) {
      this.errorMessage = 'Por favor, ingrese su correo electrónico';
      return;
    }
    try {
      this.isLoading = true;
      this.errorMessage = '';
      await this.authService.resetPassword(this.email);
      alert('Se ha enviado un correo para restablecer su contraseña');
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }
}