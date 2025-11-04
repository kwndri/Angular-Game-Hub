import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Authervice } from '../../services/authService';
import { GameQueryStore } from '../../stores/gameQuery.store';

@Component({
  standalone: true,
  selector: 'app-searchbar',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css',
})
export class SearchbarComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private gameQueryStore = inject(GameQueryStore);
  authService = inject(Authervice);
  search = signal<string | undefined>('');

  searchValue = signal<string | undefined>('');
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    search: new FormControl('', {}),
  });

  onSubmit() {
    this.search.set(this.form.value.search?.trim());
    if (!this.search()) return;

    this.gameQueryStore.setSearchQuery(this.search() || '');

    // 4️⃣ Reset the form if needed
    this.form.reset();
  }

  reloadCurrentRoute() {
    this.gameQueryStore.clearQuery();
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      onSameUrlNavigation: 'reload',
    });
  }
}
