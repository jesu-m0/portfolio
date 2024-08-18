import { Component } from '@angular/core';
import { NavbarComponent } from '../../sharedComponents/navbar/navbar.component';
import { LinkButtonComponentComponent } from '../../sharedComponents/link-button-component/link-button-component.component';

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [NavbarComponent,
    LinkButtonComponentComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {


}
