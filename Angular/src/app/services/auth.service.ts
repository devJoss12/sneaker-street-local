// auth.service.ts
import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  User, 
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UsersService } from './users.service';

export interface AuthError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private usersService = inject(UsersService);
  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();
  private lastAttemptedRoute: string | null = null;

  private adminEmails: string[] = ['j24224068@gmail.com'];

  constructor() {
    this.auth.onAuthStateChanged(user => {
      this.user.next(user);
    });
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      map(user => user ? this.adminEmails.includes(user.email!) : false)
    );
  }

  setLastAttemptedRoute(route: string) {
    this.lastAttemptedRoute = route;
  }

  async loginWithGoogle(): Promise<UserCredential | null> {
    try {
      const provider = new GoogleAuthProvider();
      const auth = this.auth;
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Guardar información del usuario en Firestore
        await this.usersService.saveUserLogin(result.user);
        
        // Verificar si el usuario es admin
        if (this.adminEmails.includes(result.user.email!)) {
          // Si es admin, redirigir al panel de administración
          await this.router.navigate(['/admin']);
        } else {
          // Si es usuario normal, mantener la lógica actual
          const redirectTo = this.lastAttemptedRoute || '/catalogo';
          this.lastAttemptedRoute = null;
          await this.router.navigate([redirectTo]);
        }
        return result;
      }
      return null;
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Ventana cerrada por el usuario');
        return null;
      }
      console.error('Error en login con Google:', error);
      throw error;
    }
  }

  private async updateUserProfile(user: User, email: string) {
    const initial = email.charAt(0).toUpperCase();
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#33FFF5']; // Colores para el avatar
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Crear un canvas para generar el avatar
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Dibujar círculo de fondo
      ctx.fillStyle = randomColor;
      ctx.beginPath();
      ctx.arc(50, 50, 50, 0, Math.PI * 2);
      ctx.fill();
      
      // Agregar inicial
      ctx.fillStyle = 'white';
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, 50, 50);
      
      // Convertir a URL de datos
      const photoURL = canvas.toDataURL();
      
      try {
        await updateProfile(user, {
          displayName: email.split('@')[0], // Usar la parte antes del @ como nombre
          photoURL: photoURL
        });
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  }

  async registerWithEmail(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      if (result.user) {
        await this.updateUserProfile(result.user, email);
        await this.usersService.saveUserLogin(result.user);
        await this.router.navigate(['/catalogo']);
      }
      return result;
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    }
  }


  async loginWithEmail(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      if (result.user) {
        // Si el usuario no tiene foto de perfil, la agregamos
        if (!result.user.photoURL) {
          await this.updateUserProfile(result.user, email);
        }
        
        if (this.adminEmails.includes(result.user.email!)) {
          await this.router.navigate(['/admin']);
        } else {
          const redirectTo = this.lastAttemptedRoute || '/catalogo';
          this.lastAttemptedRoute = null;
          await this.router.navigate([redirectTo]);
        }
      }
      return result;
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    }
  }

  // Nuevo método para recuperar contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    }
  }

  // Método auxiliar para manejar errores de autenticación
  private handleAuthError(error: AuthError): void {
    let message = '';
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Este correo electrónico ya está registrado';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'auth/user-not-found':
        message = 'No existe una cuenta con este correo electrónico';
        break;
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta';
        break;
      default:
        message = 'Error en la autenticación';
    }
    console.error(message, error);
    throw { ...error, message };
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  isLoggedIn(): Observable<User | null> {
    return this.user$;
  }
}