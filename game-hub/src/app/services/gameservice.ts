import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiResponse,
  GameDetails,
  GenreResponse,
  PlatformsResponse,
  Screenshots,
  Trailer,
} from '../../models/game.model';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Gameservice {
  private httpClient = inject(HttpClient);
  url: string = 'https://api.rawg.io/api';

  getGameList(
    url: string,
    ordering: string,
    errorMessage: string,
    platform?: string,
    search?: string,
    genre?: string
  ) {
    let params = new HttpParams().set('ordering', ordering);

    if (platform) {
      params = params.set('platforms', platform);
    }

    if (search) {
      params = params.set('search', search);
    }
    if (genre) {
      params = params.set('genres', genre);
    }

    return this.httpClient.get<ApiResponse>(url, { params }).pipe(
      map((resData) => resData),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getPlatforms(errorMessage: string) {
    return this.httpClient.get<PlatformsResponse>(this.url + '/platforms').pipe(
      map((res) => res.results),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getGameDetails(id: string, errorMessage: string) {
    return this.httpClient.get<GameDetails>(`${this.url}/games/${id}`).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getGameTrailers(id: string, errorMessage: string) {
    return this.httpClient.get<Trailer>(`${this.url}/games/${id}/movies`).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getGameScreenshots(id: string, errorMessage: string) {
    return this.httpClient
      .get<Screenshots>(`${this.url}/games/${id}/screenshots`)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getColor(value: number | undefined): string {
    if (value !== undefined) {
      if (value > 75) return '#5ee432';
      if (value > 50) return '#fffa50';
      if (value > 30) return '#f7aa38';
      return '#ef4655';
    }
    return 'green';
  }

  getGenres(errorMessage: string) {
    return this.httpClient.get<GenreResponse>(this.url + '/genres').pipe(
      map((res) => res.results),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
