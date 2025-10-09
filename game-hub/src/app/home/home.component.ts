import {
  Component,
  DestroyRef,
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
  Params,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
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
  genreName = signal<string>('');

  ngOnInit(): void {
    const resolverData = this.activatedRoute.snapshot.data['genreName'];
    if (resolverData) {
      this.genreName.set(resolverData); // if you want to store it in your signal
      console.log(resolverData);
    }

    const querySub = this.activatedRoute.queryParams.subscribe((params) => {
      const platformFromUrl =
        params['platform'] || ''; /*check from the params if any platform 
                                                or search is selected*/
      this.platform = platformFromUrl; //set the selected platform if any
      const searchTerm = params['gameSearch'] || undefined;
      this.search.set(searchTerm);
      const genreFromUrl = params['genre'] || undefined;
      if (genreFromUrl) {
        this.genreName.set(
          genreFromUrl[0].toUpperCase() +
            genreFromUrl.slice(1, genreFromUrl.length)
        );
      }

      this.searchGames(
        //make the request based on the info from the params
        'https://api.rawg.io/api/games',
        this.sort,
        this.platform || undefined,
        searchTerm,
        genreFromUrl || undefined
      );
    });

    const platformSub = this.gameService
      .getPlatforms('Cannot retrieve platforms')
      .subscribe({
        next: (res) => {
          this.platforms.set(res);
          this.selectedPlatform.set(this.platformName(this.platform));
        },
        //find the name of the selected platform if any
        error: (err) => console.error(err),
      });

    this.destroRef.onDestroy(() => {
      querySub.unsubscribe();
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
    this.selectedPlatform.set(this.platformName(this.platform));
    console.log(this.selectedPlatform());
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { platform: this.platform || null },
      queryParamsHandling: 'merge', // merge with existing query params
      replaceUrl: true, // optional, avoids adding to browser history
    });

    this.searchGames(
      'https://api.rawg.io/api/games',
      this.sort,
      this.platform || undefined
    );
  }

  onSelectGame(id: number) {
    console.log(id);
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

export const resolveGenreName: ResolveFn<string> = (
  //function to retrieve dynamic data from the url (the genre name from the slug in the url)
  activatedRoute: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot
) => {
  const slug = activatedRoute.paramMap.get('genre') || '';
  console.log(slug);

  if (slug) {
    return slug[0].toUpperCase() + slug.slice(1, slug.length);
  } else {
    return '';
  }
};
