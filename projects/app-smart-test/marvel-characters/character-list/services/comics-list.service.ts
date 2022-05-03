import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ListDimensions} from "../classes/list-dimensions";
import {filter, map, Observable, switchMap} from "rxjs";
import {Comics} from "../interfaces/comics.interface";
import {ComicsState} from "@app-smart-test/contexts";
import {comics} from "@app-smart-test/contexts";
import {MarvelComics} from "@app-smart-test/entities";
import {loadCharacterComics} from "@app-smart-test/contexts";
import {buildTree} from "../utils/tree.utils";

@Injectable()
export class ComicsListService {
  constructor(
    private readonly store: Store<any>,
  ) {
  }

  public getCharacterComicsNext(
    characterId: number,
    dimensions: ListDimensions,
    next$: Observable<void>,
  ): Observable<Comics[][]> {
    let acc: MarvelComics[] = [];
    return next$.pipe(
      switchMap(() => {
        this.store.dispatch(loadCharacterComics({
          offset: acc.length,
          limit: dimensions.cellsCount * 3,
          id: characterId,
        }));
        return this.getStoreComics(characterId).pipe(
          map((results: MarvelComics[]) => {
            acc = results;
            return buildTree(
              this.convertToComics(results),
              dimensions,
            );
          }),
        )
      }),
    );
  }

  private getStoreComics(id: number): Observable<MarvelComics[]> {
    return this.getStoreComicsState().pipe(
      map((state: ComicsState) => state.summary![id] as MarvelComics[]),
      filter((result: MarvelComics[]) => !!result),
    );
  }

  private getStoreComicsState(): Observable<ComicsState> {
    return this.store.select(comics).pipe(
      filter((state: ComicsState) => state.state !== 'pending'),
      map((state: ComicsState) => {
        if (state.state === 'error') {
          throw state.error;
        }
        return state;
      }),
    );
  }

  private convertToComics(items: MarvelComics[]): Comics[] {
    return items.map((item: MarvelComics) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail,
    }));
  }
}
