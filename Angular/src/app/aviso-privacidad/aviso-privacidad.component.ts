import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-aviso-privacidad',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './aviso-privacidad.component.html',
  styleUrl: './aviso-privacidad.component.css'
})
export class AvisoPrivacidadComponent {

}
