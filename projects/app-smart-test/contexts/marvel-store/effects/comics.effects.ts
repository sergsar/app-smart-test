import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {loadCharacterComics, loadCharacterComicsFailure, loadCharacterComicsSuccess} from "../actions/comics.action";
import {catchError, first, map, Observable, of, switchMap} from "rxjs";
import {PaginatedSinglePayload} from "../interfaces/payloads";
import {Store} from "@ngrx/store";
import {comics} from "../selectors/comics.selector";
import {ComicsState} from "../interfaces/comics-state.interface";
import {MarvelComics} from "@app-smart-test/entities";
import {MarvelApiResponse, MarvelApiResponseData, MarvelApiService} from "@app-smart-test/api";
import {KeyValueItems} from "../interfaces/key-value-items.interface";

@Injectable()
export class ComicsEffects {

  private cache?: KeyValueItems<MarvelComics>;
  private summary?: KeyValueItems<MarvelComics>;

  @Effect() // TODO: Remove decorator
  public comics: any = this.actions.pipe(
    ofType(loadCharacterComics),
    switchMap((payload: PaginatedSinglePayload) =>
      this.store.select(comics).pipe(
        first(),
        switchMap((state: ComicsState) => {
          const cache: MarvelComics[] = this.cache && this.cache[payload.id] || [];
          const offset: number = payload.offset || 0;
          const limit: number = payload.limit || cache.length!;
          const cached: MarvelComics[] = cache
            ?.slice(offset, offset + limit)
            .filter(Boolean) || [];
          if (cached.length === limit) {
            return of(
              loadCharacterComicsSuccess({
                summary: this.summary!,
              }),
            );
          }
          return this.getComics(payload.id, payload.offset, payload.limit).pipe(
            map((data: MarvelApiResponseData<MarvelComics>) => {
              const cache: MarvelComics[] = this.cache &&
                this.cache[payload.id] || new Array(data.total);
              for (let i = 0; i < data.count; i++) {
                cache[data.offset + i] = data.results[i];
              }
              this.summary = { ...this.summary, [payload.id]: cache.filter(Boolean)};
              return loadCharacterComicsSuccess({
                summary: this.summary,
              });
            }),
            catchError((error: unknown) => {
              console.error(error);
              return of(loadCharacterComicsFailure({ error }));
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

  private getComics(
    id: number,
    offset?: number,
    limit?: number,
  ): Observable<MarvelApiResponseData<MarvelComics>> {
    return this.marvelApiService
      .getComics(id, { offset, limit })
      .pipe(
        map((response: MarvelApiResponse<MarvelComics>) =>
          response.data,
        ),
    );
  }
}
