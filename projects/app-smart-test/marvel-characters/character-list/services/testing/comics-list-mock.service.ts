import {Injectable} from "@angular/core";
import {ListDimensions} from "../../classes/list-dimensions";
import {Observable, of} from "rxjs";
import {Comics} from "../../interfaces/comics.interface";

@Injectable()
export class ComicsListMockService {
  public getCharacterComicsNext(
    characterId: number,
    dimensions: ListDimensions,
    next$: Observable<void>,
  ): Observable<Comics[][]> {
    return of([]);
  }
}
