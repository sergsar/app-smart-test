import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {
  loadCharacterStories,
  loadCharacterStoriesFailure,
  loadCharacterStoriesSuccess
} from "../actions/stories.action";
import {catchError, first, map, Observable, of, switchMap} from "rxjs";
import {PaginatedSinglePayload} from "../interfaces/payloads";
import {Store} from "@ngrx/store";
import {stories} from "../selectors/stories.selector";
import {StoriesState} from "../interfaces/stories-state.interface";
import {MarvelStory} from "@app-smart-test/entities";
import {MarvelApiResponse, MarvelApiResponseData, MarvelApiService} from "@app-smart-test/api";
import {KeyValueItems} from "../interfaces/key-value-items.interface";

@Injectable()
export class StoriesEffects {

  cache?: KeyValueItems<MarvelStory>;
  summary?: KeyValueItems<MarvelStory>;

  @Effect() // TODO: Remove decorator
  public stories: any = this.actions.pipe(
    ofType(loadCharacterStories),
    switchMap((payload: PaginatedSinglePayload) =>
      this.store.select(stories).pipe(
        first(),
        switchMap((state: StoriesState) => {
          const cache: MarvelStory[] = this.cache && this.cache[payload.id] || [];
          const offset: number = payload.offset || 0;
          const limit: number = payload.limit || cache.length!;
          const cached: MarvelStory[] = cache
            ?.slice(offset, offset + limit)
            .filter(Boolean) || [];
          if (cached.length === limit) {
            return of(
              loadCharacterStoriesSuccess({
                summary: this.summary!,
              }),
            );
          }
          return this.getStories(payload.id, payload.offset, payload.limit).pipe(
            map((data: MarvelApiResponseData<MarvelStory>) => {
              const cache: MarvelStory[] = this.cache &&
                this.cache[payload.id] || new Array(data.total);
              for (let i = 0; i < data.count; i++) {
                cache[data.offset + i] = data.results[i];
              }
              this.summary = { ...state.summary, [payload.id]: cache.filter(Boolean)};
              return loadCharacterStoriesSuccess({
                summary: this.summary,
              });
            }),
            catchError((error: unknown) => {
              console.error(error);
              return of(loadCharacterStoriesFailure({ error }));
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

  private getStories(
    id: number,
    offset?: number,
    limit?: number,
  ): Observable<MarvelApiResponseData<MarvelStory>> {
    return this.marvelApiService
      .getStories(id, { offset, limit })
      .pipe(
        map((response: MarvelApiResponse<MarvelStory>) =>
          response.data,
        ),
    );
  }
}
