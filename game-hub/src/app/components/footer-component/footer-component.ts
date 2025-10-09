import { Component } from '@angular/core';
import { IconsComponent } from '../../icons/icons-component/icons-component';

@Component({
  standalone: true,
  selector: 'app-footer-component',
  imports: [IconsComponent],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.css',
})
export class FooterComponent {}
