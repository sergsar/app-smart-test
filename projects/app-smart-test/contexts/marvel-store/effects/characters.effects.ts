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

  @Effect() // TODO: Remove decorator
  public characters: any = this.actions.pipe(
    ofType(loadCharacters),
    switchMap((payload: PaginatedPayload) =>
      this.store.select(characters).pipe(
        first(),
        switchMap((state: CharactersState) => {
          const offset: number = payload.offset || 0;
          const limit: number = payload.limit || state.cache?.length!;
          const cached: MarvelCharacter[] = state.cache
            ?.slice(offset, offset + limit)
            .filter(Boolean) || [];
          if (cached.length === limit) {
            const summary: MarvelCharacter[] = state.cache?.filter(Boolean)!;
            return of(
              loadCharactersSuccess({
                cache: state.cache!,
                content: cached,
                summary,
                single: state.single!,
              }),
            );
          }
          return this.getCharacters(payload.offset, payload.limit).pipe(
            map((data: MarvelApiResponseData<MarvelCharacter>) => {
              const cache: MarvelCharacter[] = state.cache ? [...state.cache] : new Array(data.total);
              for (let i = 0; i < data.count; i++) {
                cache[data.offset + i] = data.results[i];
              }
              return loadCharactersSuccess({
                cache,
                summary: cache.filter(Boolean),
                content: data.results,
                single: state.single!,
              });
            }),
            catchError((error: unknown) => {
              console.error(error);
              return of(loadCharactersFailure({ error, cache: state.cache! }));
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
                cache: state.cache!,
                content: state.content!,
                summary: state.summary!,
                single,
              }),
            );
          }
          return this.getCharacter(payload.id).pipe(
            map((data: MarvelApiResponseData<MarvelCharacter>) => {
              const single: MarvelCharacter[] = [...state.single || [], ...data.results];
              return loadCharactersSuccess({
                cache: state.cache!,
                content: state.content!,
                summary: state.summary!,
                single,
              });
            }),
            catchError((error: unknown) => {
              console.error(error);
              return of(loadCharactersFailure({ error, cache: state.cache! }));
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
