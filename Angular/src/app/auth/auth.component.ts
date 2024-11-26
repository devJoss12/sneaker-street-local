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
  name: string = ''; 
  address: string = ''; 
  isRegistering: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  }

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
    if (!this.email || !this.password || !this.confirmPassword || !this.name || !this.address) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }
    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Por favor, ingrese un correo electrónico válido';
      return;
    }
    if (!this.validatePassword(this.password)) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres, una letra y un número';
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
    this.errorMessage = ''; // Limpiamos el mensaje de error previo
    
    if (!this.email || this.email.trim() === '') {
      this.errorMessage = 'Por favor, ingrese su correo electrónico';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Por favor, ingrese un correo electrónico válido';
      return;
    }

    try {
      this.isLoading = true;
      await this.authService.resetPassword(this.email);
      alert('Se ha enviado un correo para restablecer su contraseña');
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al intentar restablecer la contraseña';
      console.error('Error en resetPassword:', error);
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
    this.name = ''; 
    this.address = ''; 
  }
}