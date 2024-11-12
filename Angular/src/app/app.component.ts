import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,
  imports: [RouterOutlet, HeaderComponent, LoginComponent]
})
export class AppComponent { }
