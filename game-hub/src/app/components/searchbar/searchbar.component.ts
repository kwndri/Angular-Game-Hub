import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Authervice } from '../../services/authService';
import { GameQueryStore } from '../../stores/gameQuery.store';

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
  private gameQueryStore = inject(GameQueryStore);

  onSubmit(form: NgForm) {
    this.search.set(form.value.search);
    const current = this.gameQueryStore.gameQuery();

    this.gameQueryStore.setQuery({
      ...current,
      platform: '',
      search: this.search(),
      genre: '',
    });

    this.router.navigate(['search', form.value.search]);
    form.reset();

    console.log(this.search());
  }

  reloadCurrentRoute() {
    this.gameQueryStore.clearQuery();
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      onSameUrlNavigation: 'reload',
    });
  }
}
