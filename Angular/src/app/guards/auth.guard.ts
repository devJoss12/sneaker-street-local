// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          // Guardar la ruta intentada
          this.authService.setLastAttemptedRoute(route.url.join('/'));
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}