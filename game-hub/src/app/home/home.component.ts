import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Gameservice } from '../services/gameservice';
import { Game } from '../../models/game.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../components/searchbar/searchbar.component';
import { Authervice } from '../services/authService';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    SearchbarComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isLoading = signal<boolean>(true);
  sort: string = '';
  private gameService = inject(Gameservice);
  private destroRef = inject(DestroyRef);
  games = signal<Game[] | undefined>(undefined);
  private error = signal('');
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(Authervice);
  isAuthenticated = this.authService.isLoggedIn;

  ngOnInit(): void {
    const subscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params['gameSearch']) {
          this.searchGames('metacritic', params['gameSearch']);
        } else {
          this.searchGames('metacritic');
        }
      }
    );

    this.destroRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  searchGames(sort: string, search?: string): void {
    const subscription = this.gameService
      .getGameList(sort, 'Cannot retrieve games', search)
      .subscribe({
        next: (resData) => {
          this.games.set(resData);
          console.log(this.games());
          this.isLoading.set(false);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
      });

    if (search) {
      console.log(search);
    }

    this.destroRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSubmit() {
    console.log('Selected sort:', this.sort);
  }

  onSelectGame(id: number) {
    this.router.navigate(['details', id.toString()]);
  }
}
