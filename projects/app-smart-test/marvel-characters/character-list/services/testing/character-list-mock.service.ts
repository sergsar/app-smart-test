import {Injectable} from "@angular/core";
import {MarvelCharacter, MarvelCollection} from "@app-smart-test/entities";
import {map, Observable, of} from "rxjs";

import {Character} from "../../interfaces/character.interface";
import {
  ListDimensions
} from "../../classes/list-dimensions";
import {buildTree} from "../../utils/tree.utils";

@Injectable()
export class CharacterListMockService {
  constructor(

  ) {
  }

  public getCharacter(id: number): Observable<Character> {
    return of(this.getDefaultCharacter());
  }

  public getCharactersNext(
    dimensions: ListDimensions,
    next$: Observable<void>,
  ): Observable<Character[][]> {
    let acc: MarvelCharacter[] = [];
    return next$.pipe(
      map(() => {
        const items: Character[] = new Array(
          dimensions.cellsCount * dimensions.rowsCount,
        ).fill(this.getDefaultCharacter());
        return buildTree(items, dimensions);
      }),
    );
  }

  private getDefaultCharacter(): Character {
    return {
      id: 1000,
      name: 'Character',
      description: 'Character description',
      thumbnail: {
        extension: 'jpeg',
        path: '/assets/img/default-character.jpeg',
      },
      comics: {} as MarvelCollection,
      events: {} as MarvelCollection,
      stories: {} as MarvelCollection,
      series: {} as MarvelCollection,
    };
  }
}
