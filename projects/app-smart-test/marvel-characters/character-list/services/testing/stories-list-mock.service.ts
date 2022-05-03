import {Injectable} from "@angular/core";
import {ListDimensions} from "../../classes/list-dimensions";
import {Observable, of} from "rxjs";
import {Story} from "../../interfaces/story.interface";

@Injectable()
export class StoriesListMockService {
  public getCharacterStoriesNext(
    characterId: number,
    dimensions: ListDimensions,
    next$: Observable<void>,
  ): Observable<Story[][]> {
    return of([]);
  }
}
