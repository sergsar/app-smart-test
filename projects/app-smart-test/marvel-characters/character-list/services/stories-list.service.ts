import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ListDimensions} from "../classes/list-dimensions";
import {filter, map, Observable, switchMap} from "rxjs";
import {Story} from "../interfaces/story.interface";
import {StoriesState} from "@app-smart-test/contexts";
import {stories} from "@app-smart-test/contexts";
import {MarvelStory} from "@app-smart-test/entities";
import {loadCharacterStories} from "@app-smart-test/contexts";
import {buildTree} from "../utils/tree.utils";

@Injectable()
export class StoriesListService {
  constructor(
    private readonly store: Store<any>,
  ) {
  }

  public getCharacterStoriesNext(
    characterId: number,
    dimensions: ListDimensions,
    next$: Observable<void>,
  ): Observable<Story[][]> {
    let acc: MarvelStory[] = [];
    return next$.pipe(
      switchMap(() => {
        this.store.dispatch(loadCharacterStories({
          offset: acc.length,
          limit: dimensions.cellsCount * 3,
          id: characterId,
        }));
        return this.getStoreStories(characterId).pipe(
          map((results: MarvelStory[]) => {
            acc = results;
            return buildTree(
              this.convertToStory(results),
              dimensions,
            );
          }),
        )
      }),
    );
  }

  private getStoreStories(id: number): Observable<MarvelStory[]> {
    return this.getStoreStoriesState().pipe(
      map((state: StoriesState) => state.summary![id] as MarvelStory[]),
      filter((result: MarvelStory[]) => !!result),
    );
  }

  private getStoreStoriesState(): Observable<StoriesState> {
    return this.store.select(stories).pipe(
      filter((state: StoriesState) => state.state !== 'pending'),
      map((state: StoriesState) => {
        if (state.state === 'error') {
          throw state.error;
        }
        return state;
      }),
    );
  }

  private convertToStory(items: MarvelStory[]): Story[] {
    return items.map((item: MarvelStory) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail,
    }));
  }
}
