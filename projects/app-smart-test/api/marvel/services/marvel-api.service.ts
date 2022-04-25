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
import {MarvelCharacter, MarvelComics} from "@app-smart-test/entities";
import {
  MarvelRequestAuthParams,
  MarvelRequestParams
} from "../interfaces/marvel-api-request.interface";


@Injectable({
  providedIn: 'root'
})
export class MarvelApiService {

  constructor(private http: HttpClient) {

  }

  public getCharacters(params?: MarvelRequestParams):Observable<MarvelApiResponse<MarvelCharacter>> {
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

  public getComics(characterId: string, params?: MarvelRequestParams): Observable<MarvelApiResponse<MarvelComics>> {
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

  private getAuthParams(): MarvelRequestAuthParams {
    return {
      ts: MARVEL_API_TIMESTAMP,
      apikey: MARVEL_API_PUBLIC_KEY,
      hash: MARVEL_API_HASH,
    };
  }

  private processParams(params: MarvelRequestParams): MarvelRequestParams {
    if (!params) {
      return params;
    }
    let filtered: MarvelRequestParams = {};
    (Object.keys(params) as (keyof MarvelRequestParams)[])
      .forEach((key: keyof MarvelRequestParams) => {
      if (params[key] != undefined) {
        filtered[key] = params[key];
      }
    });
    return filtered;
  }
}
