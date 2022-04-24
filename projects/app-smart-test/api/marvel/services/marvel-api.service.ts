import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MARVEL_BASE_URL} from "../const/marvel-base-url.const";
import {
  MARVEL_API_HASH,
  MARVEL_API_PUBLIC_KEY,
  MARVEL_API_TIMESTAMP,
} from "../const/marvel-api-key";
import {
  MarvelApiResponse,
  MarvelCharacter,
  MarvelComics
} from "../interfaces/marvel-api-response.interface";


@Injectable({
  providedIn: 'root'
})
export class MarvelApiService {

  constructor(private http:HttpClient) {

  }

  getCharacters():Observable<MarvelApiResponse<MarvelCharacter>> {
    const url = `${MARVEL_BASE_URL}/characters?limit=10&ts=${MARVEL_API_TIMESTAMP}&apikey=${MARVEL_API_PUBLIC_KEY}&hash=${MARVEL_API_HASH}`;
    return this.http.get<MarvelApiResponse<MarvelCharacter>>(url);
  }

  getComics(characterId: string): Observable<MarvelApiResponse<MarvelComics>> {
    const url = `${MARVEL_BASE_URL}/characters/${characterId}/comics?limit=10&ts=${MARVEL_API_TIMESTAMP}&apikey=${MARVEL_API_PUBLIC_KEY}&hash=${MARVEL_API_HASH}`;
    return this.http.get<MarvelApiResponse<MarvelComics>>(url);
  }
}
