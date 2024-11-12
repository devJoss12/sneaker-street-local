// auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UsersService } from './users.service';

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
        
        // Navegar a la última ruta intentada o al catálogo por defecto
        const redirectTo = this.lastAttemptedRoute || '/catalogo';
        this.lastAttemptedRoute = null;
        await this.router.navigate([redirectTo]);
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