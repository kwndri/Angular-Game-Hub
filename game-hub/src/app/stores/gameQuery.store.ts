import { computed, Injectable, signal } from '@angular/core';

export interface GameQuery {
  sort: string;
  platform: string;
  search: string;
  genre: string;
}

@Injectable({ providedIn: 'root' })
export class GameQueryStore {
  private _query = signal<GameQuery>({
    sort: '-added',
    platform: '',
    search: '',
    genre: '',
  });

  readonly gameQuery = computed(() => this._query());

  setQuery(newQuery: GameQuery) {
    this._query.set(newQuery);
  }

  clearQuery() {
    this._query.set({
      sort: '-added',
      platform: '',
      search: '',
      genre: '',
    });
  }
}
