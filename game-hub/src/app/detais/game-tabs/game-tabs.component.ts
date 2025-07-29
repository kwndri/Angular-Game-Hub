import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Gameservice } from '../../services/gameservice';
import { GameDetails, Screenshots, Trailer } from '../../../models/game.model';

@Component({
  standalone: true,
  selector: 'app-game-tabs',
  imports: [MatTabsModule],
  templateUrl: './game-tabs.component.html',
  styleUrl: './game-tabs.component.css',
})
export class GameTabsComponent {
  gameService = inject(Gameservice);
  private destroRef = inject(DestroyRef);
  details = input<GameDetails | undefined>();
  screenshots = input<Screenshots | undefined>();
  private error = signal('');
  trailers = input<Trailer | undefined>();
}
