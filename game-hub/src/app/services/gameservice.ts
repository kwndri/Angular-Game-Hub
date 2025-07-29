import {
  HttpClient,
  HttpInterceptorFn,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiResponse,
  GameDetails,
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

  getGameList(ordering: string, errorMessage: string, search?: string) {
    let params = new HttpParams().set('ordering', ordering);

    if (search) {
      params = params.set('search', search);
    }

    return this.httpClient
      .get<ApiResponse>(this.url + '/games', { params: params })
      .pipe(
        map((resData) => resData.results),
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getGameDetails(id: string, errorMessage: string) {
    return this.httpClient.get<GameDetails>(this.url + '/games/' + id).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getGameTrailers(id: string, errorMessage: string) {
    return this.httpClient
      .get<Trailer>(this.url + '/games/' + id + '/movies')
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getGameScreenshots(id: string, errorMessage: string) {
    return this.httpClient
      .get<Screenshots>(this.url + '/games/' + id + '/screenshots')
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getColor(value: number | undefined): string {
    if (value) {
      if (value > 75) {
        return '#5ee432';
      } else if (value > 50) {
        return '#fffa50';
      } else if (value > 30) {
        return '#f7aa38';
      } else {
        return '#ef4655';
      }
    }

    return 'green';
  }
}
