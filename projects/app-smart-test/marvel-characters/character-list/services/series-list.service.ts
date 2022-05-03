import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ListDimensions} from "../classes/list-dimensions";
import {filter, map, Observable, switchMap} from "rxjs";
import {Series} from "../interfaces/series.interface";
import {SeriesState} from "@app-smart-test/contexts";
import {series} from "@app-smart-test/contexts";
import {MarvelSeries} from "@app-smart-test/entities";
import {loadCharacterSeries} from "@app-smart-test/contexts";
import {buildTree} from "../utils/tree.utils";

@Injectable()
export class SeriesListService {
  constructor(
    private readonly store: Store<any>,
  ) {
  }

  public getCharacterSeriesNext(
    characterId: number,
    dimensions: ListDimensions,
    next$: Observable<void>,
  ): Observable<Series[][]> {
    let acc: MarvelSeries[] = [];
    return next$.pipe(
      switchMap(() => {
        this.store.dispatch(loadCharacterSeries({
          offset: acc.length,
          limit: dimensions.cellsCount * 3,
          id: characterId,
        }));
        return this.getStoreSeries(characterId).pipe(
          map((results: MarvelSeries[]) => {
            acc = results;
            return buildTree(
              this.convertToSeries(results),
              dimensions,
            );
          }),
        )
      }),
    );
  }

  private getStoreSeries(id: number): Observable<MarvelSeries[]> {
    return this.getStoreSeriesState().pipe(
      map((state: SeriesState) => state.summary![id] as MarvelSeries[]),
      filter((result: MarvelSeries[]) => !!result),
    );
  }

  private getStoreSeriesState(): Observable<SeriesState> {
    return this.store.select(series).pipe(
      filter((state: SeriesState) => state.state !== 'pending'),
      map((state: SeriesState) => {
        if (state.state === 'error') {
          throw state.error;
        }
        return state;
      }),
    );
  }

  private convertToSeries(items: MarvelSeries[]): Series[] {
    return items.map((item: MarvelSeries) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail,
    }));
  }
}
