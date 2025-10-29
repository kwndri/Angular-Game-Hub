import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Gameservice } from '../services/gameservice';
import { Game, GamePlatform, Genre } from '../../models/game.model';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CommonModule } from '@angular/common';
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
    MatProgressSpinnerModule,
    CriticScoreComponent,
    EmojiComponent,
    GenreMenuComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  gameQuery = signal({
    sort: '-added',
    platform: '',
    search: '',
    genre: '',
  });

  //Retrieving the query params using the input signals
  sort = input<string | undefined>('-added');
  platform = input<string | undefined>();
  search = input<string | undefined>();
  genre = input<string | undefined>();
  selectedSort: string = '-added';
  platformSelected: string = '';
  isLoading = signal<boolean>(true);
  games = signal<Game[] | undefined>(undefined);
  next = signal<string>('');
  previous = signal<string>('');
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
  genreName = input.required<string>();

  constructor() {
    // Automatically fetch games whenever query state changes
    effect(() => {
      const { sort, platform, search, genre } = this.gameQuery();

      // Don’t trigger before init or if query is incomplete
      if (!sort) return;

      this.searchGames(
        'https://api.rawg.io/api/games',
        sort,
        platform,
        search,
        genre
      );
    });
  }
  ngOnInit(): void {
    //ANOTHER WAY TO RETRIEVE QUERY PARAMS USING OBSERVABLES

    /*const querySub = this.activatedRoute.queryParams.subscribe((params) => {
      const platformFromUrl = params['platform'] || '';
      this.platform = platformFromUrl;
      const searchTerm = params['gameSearch'] || undefined;
      //this.search.set(searchTerm); 
      // const genreFromUrl =params['genre'] || undefined;
      this.gameQuery.update((state) => ({
        ...state,
        platform: platformFromUrl,
        serach: searchTerm,
        genre: genreFromUrl,
      }));
    });  */

    this.gameQuery.update((state) => ({
      ...state,
      platform: this.platform() || '',
      serach: this.search(),
      genre: this.genre() || '',
    }));

    const platformSub = this.gameService
      .getPlatforms('Cannot retrieve platforms')
      .subscribe({
        next: (res) => {
          this.platforms.set(res);
        },

        error: (err) => console.error(err),
      });

    this.destroRef.onDestroy(() => {
      platformSub.unsubscribe();
    });
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
    this.gameQuery.update((state) => ({
      ...state,
      sort: this.selectedSort,
      platform: this.platformSelected,
    }));
    this.selectedPlatform.set(this.platformName(this.gameQuery().platform));
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        platform: this.platformSelected || null,
        sort: this.selectedSort || null,
      },
      queryParamsHandling: 'merge', // merge with existing query params
      replaceUrl: true, // optional, avoids adding to browser history
    });
  }

  onSelectGame(id: number) {
    console.log(id);
    this.router.navigate(['details', id.toString()]);
  }

  onSelectGenre(genre: Genre) {
    this.gameQuery.update((state) => ({
      ...state,
      genre: genre.slug,
    }));
  }

  onLoadMore() {
    this.searchGames(
      this.next(),
      this.gameQuery().sort,
      this.gameQuery().platform || undefined,
      undefined,
      this.gameQuery().genre || undefined
    );
  }

  onPreviousPage() {
    this.searchGames(
      this.previous(),
      this.gameQuery().sort,
      this.gameQuery().platform || undefined,
      undefined,
      this.gameQuery().genre || undefined
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

export const resolveGenreName: ResolveFn<string> = (
  //function to retrieve dynamic data from the url (from the userId i am getting the username here)
  activatedRoute: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot
) => {
  const genre = activatedRoute.queryParams['genre'];
  if (genre) {
    const genreName = genre[0].toUpperCase() + genre.slice(1, genre.length);
    return genreName;
  } else {
    const genreName = '';
    return genreName;
  }
};
