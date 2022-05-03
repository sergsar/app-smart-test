import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {
  loadCharacter,
  loadCharacters,
  loadCharactersFailure,
  loadCharactersSuccess,
} from "../actions/characters.action";
import {catchError, filter, first, map, Observable, of, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {MarvelApiResponse, MarvelApiResponseData, MarvelApiService} from "@app-smart-test/api";
import {MarvelCharacter} from "@app-smart-test/entities";
import {PaginatedPayload, SinglePayload} from "../interfaces/payloads";
import {characters} from "../selectors/characters.selector";
import {CharactersState} from "../interfaces/characters-state.interface";

@Injectable()
export class CharactersEffects {

  private cache?: MarvelCharacter[];
  private summary?: MarvelCharacter[];

  @Effect() // TODO: Remove decorator
  public characters: any = this.actions.pipe(
    ofType(loadCharacters),
    switchMap((payload: PaginatedPayload) =>
      this.store.select(characters).pipe(
        first(),
        switchMap((state: CharactersState) => {
          const offset: number = payload.offset || 0;
          const limit: number = payload.limit || this.cache?.length!;
          const cached: MarvelCharacter[] = this.cache
            ?.slice(offset, offset + limit)
            .filter(Boolean) || [];
          if (cached.length === limit) {
            return of(
              loadCharactersSuccess({
                summary: this.summary!,
                single: state.single!,
              }),
            );
          }
          return this.getCharacters(payload.offset, payload.limit).pipe(
            map((data: MarvelApiResponseData<MarvelCharacter>) => {
              this.cache = this.cache ? [...this.cache] : new Array(data.total);
              for (let i = 0; i < data.count; i++) {
                this.cache[data.offset + i] = data.results[i];
              }
              this.summary = this.cache.filter(Boolean);
              return loadCharactersSuccess({
                summary: this.cache.filter(Boolean),
                single: state.single!,
              });
            }),
            catchError((error: unknown) => {
              console.error(error);
              return of(loadCharactersFailure({ error }));
            }),
          );
        }),
      ),
    ),
  );

  @Effect() // TODO: Remove decorator
  character = this.actions.pipe(
    ofType(loadCharacter),
    switchMap((payload: SinglePayload) =>
      this.store.select(characters).pipe(
        first(),
        switchMap((state: CharactersState) => {
          const result: MarvelCharacter =
            state.single?.find((item: MarvelCharacter) => item.id === payload.id) ||
          state.summary?.find((item: MarvelCharacter) => item.id === payload.id)!;
          if (result) {
            const single: MarvelCharacter[] = [...state.single || [], result];
            return of(
              loadCharactersSuccess({
                summary: this.summary!,
                single,
              }),
            );
          }
          return this.getCharacter(payload.id).pipe(
            map((data: MarvelApiResponseData<MarvelCharacter>) => {
              const single: MarvelCharacter[] = [...state.single || [], ...data.results];
              return loadCharactersSuccess({
                summary: this.summary!,
                single,
              });
            }),
            catchError((error: unknown) => {
              console.error(error);
              return of(loadCharactersFailure({ error }));
            }),
          );
        }),
      ),
    ),
  );

  constructor(
    private readonly actions: Actions,
    private store: Store<any>,
    private marvelApiService: MarvelApiService,
  ) {
  }

  private getCharacters(offset?: number, limit?: number): Observable<MarvelApiResponseData<MarvelCharacter>> {
    return this.marvelApiService.getCharacters({ offset, limit }).pipe(
      map((response: MarvelApiResponse<MarvelCharacter>) =>
        response.data,
      ),
    );
  }

  private getCharacter(id: number): Observable<MarvelApiResponseData<MarvelCharacter>> {
    return this.marvelApiService.getCharacter(id).pipe(
      map((response: MarvelApiResponse<MarvelCharacter>) =>
        response.data,
      ),
    );
  }
}
