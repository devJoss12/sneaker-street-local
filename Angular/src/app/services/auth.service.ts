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
        await this.usersService.saveUserLogin(result.user);
        if (this.adminEmails.includes(result.user.email!)) {
          await this.router.navigate(['/admin']);
        } else {
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
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#33FFF5']; 
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      
      ctx.fillStyle = randomColor;
      ctx.beginPath();
      ctx.arc(50, 50, 50, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, 50, 50);
      
      const photoURL = canvas.toDataURL();
      
      try {
        await updateProfile(user, {
          displayName: email.split('@')[0], 
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

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, 'dummyPassword123!@#');
      return true;
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        return true; // El email existe pero la contraseña es incorrecta
      }
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        return false; // El email no existe
      }
      throw error; // Otros errores
    }
  }

  async resetPassword(email: string): Promise<void> {
    if (!email || email.trim() === '') {
      throw {
        code: 'auth/missing-email',
        message: 'Por favor, ingrese su correo electrónico'
      };
    }

    try {
      const emailExists = await this.checkEmailExists(email);
      
      if (!emailExists) {
        throw {
          code: 'auth/user-not-found',
          message: 'El correo electrónico no está registrado'
        };
      }

      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        throw {
          code: 'auth/too-many-requests',
          message: 'Demasiados intentos. Por favor, intente más tarde'
        };
      }
      // Si el error ya tiene un mensaje personalizado, lo mantenemos
      if (error.message) {
        throw error;
      }
      this.handleAuthError(error);
    }
  }

  private handleAuthError(error: any): void {
    let message = '';
    switch (error.code) {
      case 'auth/missing-email':
        message = 'Por favor, ingrese su correo electrónico';
        break;
      case 'auth/email-already-in-use':
        message = 'Este correo electrónico ya está registrado';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        message = 'El correo electrónico no está registrado';
        break;
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-email':
        message = 'El formato del correo electrónico no es válido';
        break;
      case 'auth/too-many-requests':
        message = 'Demasiados intentos. Por favor, intente más tarde';
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