import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {loadCharacterEvents, loadCharacterEventsFailure, loadCharacterEventsSuccess} from "../actions/events.action";
import {catchError, first, map, Observable, of, switchMap} from "rxjs";
import {PaginatedSinglePayload} from "../interfaces/payloads";
import {Store} from "@ngrx/store";
import {events} from "../selectors/events.selector";
import {EventsState} from "../interfaces/events-state.interface";
import {MarvelEvent} from "@app-smart-test/entities";
import {MarvelApiResponse, MarvelApiResponseData, MarvelApiService} from "@app-smart-test/api";
import {KeyValueItems} from "../interfaces/key-value-items.interface";

@Injectable()
export class EventsEffects {

  private cache?: KeyValueItems<MarvelEvent>;
  private summary?: KeyValueItems<MarvelEvent>;

  @Effect() // TODO: Remove decorator
  public events: any = this.actions.pipe(
    ofType(loadCharacterEvents),
    switchMap((payload: PaginatedSinglePayload) =>
      this.store.select(events).pipe(
        first(),
        switchMap((state: EventsState) => {
          const cache: MarvelEvent[] = this.cache && this.cache[payload.id] || [];
          const offset: number = payload.offset || 0;
          const limit: number = payload.limit || cache.length!;
          const cached: MarvelEvent[] = cache
            ?.slice(offset, offset + limit)
            .filter(Boolean) || [];
          if (cached.length === limit) {
            return of(
              loadCharacterEventsSuccess({
                summary: this.summary!,
              }),
            );
          }
          return this.getEvents(payload.id, payload.offset, payload.limit).pipe(
            map((data: MarvelApiResponseData<MarvelEvent>) => {
              const cache: MarvelEvent[] = this.cache &&
                this.cache[payload.id] || new Array(data.total);
              for (let i = 0; i < data.count; i++) {
                cache[data.offset + i] = data.results[i];
              }
              this.summary = { ...state.summary, [payload.id]: cache.filter(Boolean)};
              return loadCharacterEventsSuccess({
                summary: this.summary,
              });
            }),
            catchError((error: unknown) => {
              console.error(error);
              return of(loadCharacterEventsFailure({ error }));
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

  private getEvents(
    id: number,
    offset?: number,
    limit?: number,
  ): Observable<MarvelApiResponseData<MarvelEvent>> {
    return this.marvelApiService
      .getEvents(id, { offset, limit })
      .pipe(
        map((response: MarvelApiResponse<MarvelEvent>) =>
          response.data,
        ),
    );
  }
}
