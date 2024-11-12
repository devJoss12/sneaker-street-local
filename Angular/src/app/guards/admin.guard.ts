// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAdmin().pipe(
      take(1),
      map(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
}