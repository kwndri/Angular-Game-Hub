import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Authervice } from '../../services/authService';

@Component({
  standalone: true,
  selector: 'app-searchbar',
  imports: [FormsModule, RouterModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css',
})
export class SearchbarComponent {
  authService = inject(Authervice);
  router = inject(Router);
  search = signal<string>('');
  private activatedRoute = inject(ActivatedRoute);

  onSubmit(form: NgForm) {
    this.router.navigate(['search', form.value.search]);
    this.search.set(form.value.search);
    console.log(this.search());
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      onSameUrlNavigation: 'reload',
    });
  }
}
