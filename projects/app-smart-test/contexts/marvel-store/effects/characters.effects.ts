import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {
  loadCharacters,
  loadCharactersFailure,
  loadCharactersSuccess,
} from "../actions/characters.action";
import {catchError, first, map, Observable, of, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {MarvelApiResponse, MarvelApiResponseData, MarvelApiService} from "@app-smart-test/api";
import {MarvelCharacter} from "@app-smart-test/entities";
import {BasePayload} from "../interfaces/payloads";
import {characters} from "../selectors/characters.selector";
import {CharactersState} from "../interfaces/characters-state.interface";

@Injectable()
export class CharactersEffects {

  @Effect() // TODO: Remove decorator
  public characters: any = this.actions.pipe(
    ofType(loadCharacters),
    switchMap((payload: BasePayload) =>
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
                pagination: {
                  count: cached.length,
                  limit,
                  offset,
                  total: state.cache?.length!
                },
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
                pagination: {
                  count: data.count,
                  limit: data.limit,
                  offset: data.offset,
                  total: data.total,
                },
              });
            }),
            catchError((error: unknown) => {
              console.log(error);
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
}
