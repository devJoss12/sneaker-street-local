import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,
  imports: [RouterOutlet, HeaderComponent, AuthComponent]
})
export class AppComponent { }
