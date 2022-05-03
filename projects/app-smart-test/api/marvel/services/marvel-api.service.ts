import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {MARVEL_BASE_URL} from "../const/marvel-base-url.const";
import {
  MARVEL_API_HASH,
  MARVEL_API_PUBLIC_KEY,
  MARVEL_API_TIMESTAMP,
} from "../const/marvel-api-key";
import {
  MarvelApiResponse,
} from "../interfaces/marvel-api-response.interface";
import {MarvelCharacter, MarvelComics, MarvelEvent, MarvelSeries, MarvelStory} from "@app-smart-test/entities";
import {
  MarvelRequestAuthParams,
  MarvelPaginatedRequestParams, MarvelRequestParams
} from "../interfaces/marvel-api-request.interface";


@Injectable({
  providedIn: 'root'
})
export class MarvelApiService {

  constructor(private http: HttpClient) {

  }

  public getCharacters(params?: MarvelPaginatedRequestParams): Observable<MarvelApiResponse<MarvelCharacter>> {
    return this.http.get<MarvelApiResponse<MarvelCharacter>>(
      `${MARVEL_BASE_URL}/characters`,
      {
        params: {
          ...this.getAuthParams(),
          ...this.processParams(params!),
        },
      },
    );
  }

  public getCharacter(id: number): Observable<MarvelApiResponse<MarvelCharacter>> {
    return this.http.get<MarvelApiResponse<MarvelCharacter>>(
      `${MARVEL_BASE_URL}/characters/${id}`,
      {
        params: {
          ...this.getAuthParams(),
        },
      },
    );
  }

  public getComics(characterId: number, params?: MarvelPaginatedRequestParams): Observable<MarvelApiResponse<MarvelComics>> {
    return this.http.get<MarvelApiResponse<MarvelComics>>(
      `${MARVEL_BASE_URL}/characters/${characterId}/comics`,
      {
        params: {
          ...this.getAuthParams(),
          ...this.processParams(params!),
        },
      },
    );
  }

  public getStories(characterId: number, params?: MarvelPaginatedRequestParams): Observable<MarvelApiResponse<MarvelStory>> {
    return this.http.get<MarvelApiResponse<MarvelComics>>(
      `${MARVEL_BASE_URL}/characters/${characterId}/stories`,
      {
        params: {
          ...this.getAuthParams(),
          ...this.processParams(params!),
        },
      },
    );
  }

  public getEvents(characterId: number, params?: MarvelPaginatedRequestParams): Observable<MarvelApiResponse<MarvelEvent>> {
    return this.http.get<MarvelApiResponse<MarvelComics>>(
      `${MARVEL_BASE_URL}/characters/${characterId}/events`,
      {
        params: {
          ...this.getAuthParams(),
          ...this.processParams(params!),
        },
      },
    );
  }

  public getSeries(characterId: number, params?: MarvelPaginatedRequestParams): Observable<MarvelApiResponse<MarvelSeries>> {
    return this.http.get<MarvelApiResponse<MarvelComics>>(
      `${MARVEL_BASE_URL}/characters/${characterId}/series`,
      {
        params: {
          ...this.getAuthParams(),
          ...this.processParams(params!),
        },
      },
    );
  }

  private getAuthParams(): MarvelRequestAuthParams {
    return {
      ts: MARVEL_API_TIMESTAMP,
      apikey: MARVEL_API_PUBLIC_KEY,
      hash: MARVEL_API_HASH,
    };
  }

  private processParams(params: any): any {
    if (!params) {
      return params;
    }
    let filtered: any = {};
    (Object.keys(params) as (keyof MarvelPaginatedRequestParams)[])
      .forEach((key: keyof MarvelPaginatedRequestParams) => {
      if (params[key] !== undefined) {
        filtered[key] = params[key];
      }
    });
    return filtered;
  }
}
