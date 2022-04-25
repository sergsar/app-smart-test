import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {
  loadCharacters,
  loadCharactersFailure,
  loadCharactersSuccess,
  loadingCharacters
} from "../actions/characters.action";
import {catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {Store} from "@ngrx/store";
import {MarvelApiResponse, MarvelApiResponseData, MarvelApiService} from "@app-smart-test/api";
import {MarvelCharacter} from "@app-smart-test/entities";
import {BasePayload} from "../interfaces/payloads";

@Injectable()
export class CharactersEffects {
  @Effect() // TODO: Remove decorator
  public characters: any = this.actions.pipe(
    ofType(loadCharacters),
    tap(() => this.store.dispatch(loadingCharacters())),
    switchMap((props: BasePayload) =>
      this.getCharacters(props.offset, props.limit).pipe(
        map((data: MarvelApiResponseData<MarvelCharacter>) => {
          return loadCharactersSuccess({
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
          return of(loadCharactersFailure({ error }));
        }),
      )
    )
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
