// auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  constructor() {
    this.auth.onAuthStateChanged(user => {
      this.user.next(user);
    });
  }

  async loginWithGoogle(): Promise<UserCredential | null> {
    try {
      const provider = new GoogleAuthProvider();
      const auth = this.auth;
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        await this.router.navigate(['/catalogo']);
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