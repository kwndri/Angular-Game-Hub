import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { Genre, GenreResponse } from '../../../models/game.model';
import { Gameservice } from '../../services/gameservice';

@Component({
  selector: 'app-genre-menu-component',
  imports: [],
  templateUrl: './genre-menu-component.html',
  styleUrl: './genre-menu-component.css',
})
export class GenreMenuComponent {
  genres = signal<Genre[] | undefined>(undefined);
  private gameService = inject(Gameservice);
  private destroRef = inject(DestroyRef);
  selectedGenre = output<Genre>();

  ngOnInit(): void {
    const subscription = this.gameService
      .getGenres('Cannot retrieve platforms')
      .subscribe({
        next: (res) => {
          this.genres.set(res), console.log(this.genres());
        },
        error: (err) => console.error(err),
      });

    this.destroRef.onDestroy(() => subscription.unsubscribe());
  }

  onClick(genre: Genre) {
    this.selectedGenre.emit(genre);
  }
}
