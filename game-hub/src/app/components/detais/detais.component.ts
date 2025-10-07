import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Gameservice } from '../../services/gameservice';
import { ActivatedRoute, Params } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { GameDetails, Screenshots, Trailer } from '../../../models/game.model';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { GameTabsComponent } from '../../detais/game-tabs/game-tabs.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { CriticScoreComponent } from '../critic-score-component/critic-score-component';

@Component({
  standalone: true,
  selector: 'app-detais',
  imports: [
    CommonModule,
    DatePipe,
    SearchbarComponent,
    GameTabsComponent,
    NgxGaugeModule,
    CriticScoreComponent,
  ],
  templateUrl: './detais.component.html',
  styleUrl: './detais.component.css',
})
export class DetailsComponent implements OnInit {
  private gameService = inject(Gameservice);
  private destroRef = inject(DestroyRef);
  details = signal<GameDetails | undefined>(undefined);
  trailers = signal<Trailer | undefined>(undefined);
  screenshots = signal<Screenshots | undefined>(undefined);
  private error = signal('');
  private activatedRoute = inject(ActivatedRoute);
  gameId = input.required<string>();
  id = signal<string>('');
  color = signal('');
  showLess = signal<boolean>(true);

  ngOnInit() {
    const subscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.id.set(params['id']);
        if (this.gameId()) {
          this.searchGameDetails(this.gameId());
          this.searchGameTrailers(this.gameId());
          this.searchGameScreenshots(this.gameId());
        }

        console.log(this.gameId());
      }
    );

    this.destroRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  searchGameDetails(id: string): void {
    const subscription = this.gameService
      .getGameDetails(id, 'Cannot retrieve game details')
      .subscribe({
        next: (resData) => {
          this.details.set(resData);
          this.setColor();
          console.log(this.details());
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
      });

    this.destroRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  searchGameTrailers(id: string): void {
    const subscription = this.gameService
      .getGameTrailers(id, 'Cannot retrieve game details')
      .subscribe({
        next: (resData) => {
          this.trailers.set(resData);
          console.log('Trailers', this.trailers());
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
      });

    this.destroRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  searchGameScreenshots(id: string): void {
    const subscription = this.gameService
      .getGameScreenshots(id, 'Cannot retrieve game screenshots')
      .subscribe({
        next: (resData) => {
          this.screenshots.set(resData);
          console.log('Screenshots', this.screenshots());
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
      });
    this.destroRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  setColor() {
    if (this.details() && this.details()?.metacritic) {
      let new_color = this.gameService.getColor(this.details()?.metacritic);
      this.color.set(new_color);
    }
  }

  setDescription(description: string | undefined) {
    if (this.showLess() && description) {
      return `${description.substring(0, 300)}...`;
    } else {
      return `${description} `;
    }
  }

  onClickDescription() {
    this.showLess.set(!this.showLess());
  }

  get videoSrc() {
    const results = this.trailers()?.results;
    if (results && results.length > 0 && results[0]?.data?.[480]) {
      return results[0].data[480];
    }
    return '';
  }

  get videoPoster() {
    const results = this.trailers()?.results;
    if (results && results.length > 0 && results[0]?.preview) {
      return results[0].preview;
    }
    return '';
  }
}
