import { Component } from '@angular/core';
import { SearchbarComponent } from '../components/searchbar/searchbar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../components/footer-component/footer-component';

@Component({
  selector: 'app-main-layout-component',
  imports: [SearchbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.css',
})
export class MainLayoutComponent {}
