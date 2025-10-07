import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Gameservice } from '../services/gameservice';
import { Game, GamePlatform, Genre } from '../../models/game.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../components/searchbar/searchbar.component';
import { Authervice } from '../services/authService';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CriticScoreComponent } from '../components/critic-score-component/critic-score-component';
import { EmojiComponent } from '../components/emoji-component/emoji-component';
import { GenreMenuComponent } from '../components/genre-menu-component/genre-menu-component';

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
    CriticScoreComponent,
    EmojiComponent,
    GenreMenuComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isLoading = signal<boolean>(true);
  sort: string = '-added';
  platform: string = '';
  genre: string = '';
  games = signal<Game[] | undefined>(undefined);
  next = signal<string>('');
  previous = signal<string>('');
  search = signal<string | undefined>('');
  private error = signal('');
  platforms = signal<GamePlatform[] | undefined>(undefined);
  private gameService = inject(Gameservice);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private destroRef = inject(DestroyRef);
  private authService = inject(Authervice);
  isAuthenticated = this.authService.isLoggedIn;
  selectedGenre: Genre | undefined;
  selectedPlatform = signal('');

  ngOnInit(): void {
    const subscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        const searchTerm = params['gameSearch'] || undefined;
        this.search.set(searchTerm);
        this.searchGames(
          'https://api.rawg.io/api/games',
          this.sort,
          this.platform || undefined,
          searchTerm
        );
      }
    );

    const platformSub = this.gameService
      .getPlatforms('Cannot retrieve platforms')
      .subscribe({
        next: (res) => this.platforms.set(res),
        error: (err) => console.error(err),
      });

    this.destroRef.onDestroy(() => subscription.unsubscribe());
  }

  searchGames(
    url: string,
    sort: string,
    platform?: string,
    search?: string,
    genre?: string
  ): void {
    this.isLoading.set(true);

    const subscription = this.gameService
      .getGameList(url, sort, 'Cannot retrieve games', platform, search, genre)
      .subscribe({
        next: (resData) => {
          console.log(resData);
          this.games.set(resData.results);
          if (resData.next) {
            this.next.set(resData.next);
          } else {
            this.next.set('');
          }
          if (resData.previous) {
            this.previous.set(resData.previous);
          } else {
            this.previous.set('');
          }
          console.log(this.games());
          this.isLoading.set(false);
        },
        error: (error: Error) => {
          this.error.set(error.message);
          this.isLoading.set(false);
        },
      });

    this.destroRef.onDestroy(() => subscription.unsubscribe());
  }

  onSortOrPlatformChange() {
    this.selectedPlatform.set(this.platformName(this.platform));
    console.log(this.selectedPlatform());
    this.searchGames(
      'https://api.rawg.io/api/games',
      this.sort,
      this.platform || undefined
    );
  }

  onSelectGame(id: number) {
    this.router.navigate(['details', id.toString()]);
  }

  onSelectGenre(genre: Genre) {
    this.selectedGenre = genre;
    this.searchGames(
      'https://api.rawg.io/api/games',
      this.sort,
      this.platform || undefined,
      undefined,
      genre.slug
    );
  }

  onLoadMore() {
    this.searchGames(
      this.next(),
      this.sort,
      this.platform || undefined,
      this.search() || undefined,
      this.genre || undefined
    );
  }

  onPreviousPage() {
    this.searchGames(
      this.previous(),
      this.sort,
      this.platform || undefined,
      this.search() || undefined,
      this.genre || undefined
    );
  }

  platformName(id: string) {
    let selectedPlatform = this.platforms()?.filter(
      (platform) => platform.id == id
    );
    if (selectedPlatform) {
      return selectedPlatform[0]?.name;
    }

    return '';
  }
}
