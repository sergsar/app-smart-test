import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {loadCharacterSeries, loadCharacterSeriesFailure, loadCharacterSeriesSuccess} from "../actions/series.action";
import {catchError, first, map, Observable, of, switchMap} from "rxjs";
import {PaginatedSinglePayload} from "../interfaces/payloads";
import {Store} from "@ngrx/store";
import {series} from "../selectors/series.selector";
import {SeriesState} from "../interfaces/series-state.interface";
import {MarvelSeries} from "@app-smart-test/entities";
import {MarvelApiResponse, MarvelApiResponseData, MarvelApiService} from "@app-smart-test/api";
import {KeyValueItems} from "../interfaces/key-value-items.interface";

@Injectable()
export class SeriesEffects {

  private cache?: KeyValueItems<MarvelSeries>;
  private summary?: KeyValueItems<MarvelSeries>;

  @Effect() // TODO: Remove decorator
  public series: any = this.actions.pipe(
    ofType(loadCharacterSeries),
    switchMap((payload: PaginatedSinglePayload) =>
      this.store.select(series).pipe(
        first(),
        switchMap((state: SeriesState) => {
          const cache: MarvelSeries[] = this.cache && this.cache[payload.id] || [];
          const offset: number = payload.offset || 0;
          const limit: number = payload.limit || cache.length!;
          const cached: MarvelSeries[] = cache
            ?.slice(offset, offset + limit)
            .filter(Boolean) || [];
          if (cached.length === limit) {
            return of(
              loadCharacterSeriesSuccess({
                summary: this.summary!,
              }),
            );
          }
          return this.getSeries(payload.id, payload.offset, payload.limit).pipe(
            map((data: MarvelApiResponseData<MarvelSeries>) => {
              const cache: MarvelSeries[] = this.cache &&
                this.cache[payload.id] || new Array(data.total);
              for (let i = 0; i < data.count; i++) {
                cache[data.offset + i] = data.results[i];
              }
              this.summary = { ...state.summary, [payload.id]: cache.filter(Boolean)};
              return loadCharacterSeriesSuccess({
                summary: this.summary,
              });
            }),
            catchError((error: unknown) => {
              console.error(error);
              return of(loadCharacterSeriesFailure({ error }));
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

  private getSeries(
    id: number,
    offset?: number,
    limit?: number,
  ): Observable<MarvelApiResponseData<MarvelSeries>> {
    return this.marvelApiService
      .getSeries(id, { offset, limit })
      .pipe(
        map((response: MarvelApiResponse<MarvelSeries>) =>
          response.data,
        ),
    );
  }
}
