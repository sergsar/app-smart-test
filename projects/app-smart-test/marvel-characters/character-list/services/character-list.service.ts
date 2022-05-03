import {Injectable} from "@angular/core";
import {MarvelCharacter} from "@app-smart-test/entities";
import {catchError, filter, map, Observable, of, switchMap} from "rxjs";
import {characters, CharactersState, loadCharacter, loadCharacters} from "@app-smart-test/contexts";
import {Character} from "../interfaces/character.interface";
import {
  ListDimensions
} from "../classes/list-dimensions";
import {Store} from "@ngrx/store";
import {buildTree} from '../utils/tree.utils';

@Injectable()
export class CharacterListService {
  constructor(
    private readonly store: Store<any>,
  ) {
  }

  public getCharacter(id: number): Observable<Character> {
    this.store.dispatch(loadCharacter({ id }));
    return this.getStoreCharacter(id).pipe(
      map((result: MarvelCharacter) =>
        this.convertToCharacter(result),
      ),
    );
  }

  public getCharactersNext(
    dimensions: ListDimensions,
    next$: Observable<void>,
  ): Observable<Character[][]> {
    let acc: MarvelCharacter[] = [];
    return next$.pipe(
      switchMap(() => {
        this.store.dispatch(loadCharacters({
          offset: acc.length,
          limit: dimensions.cellsCount * 3,
        }));
        return this.getStoreCharacters().pipe(
          map((results: MarvelCharacter[]) => {
            acc = results;
            return buildTree(
              this.convertToCharacters(results),
              dimensions,
            );
          }),
          catchError((err) => {
            console.error(err);
            return of(
              buildTree(
                this.convertToCharacters(acc),
                dimensions,
              ),
            );
          }),
        );
      }),
    );
  }

  private getStoreCharacter(id: number): Observable<MarvelCharacter> {
    return this.getStoreCharactersState().pipe(
      map((state: CharactersState) =>
        state.single?.find((item: MarvelCharacter) => item.id === id) as MarvelCharacter,
      ),
      filter((result: MarvelCharacter) => !!result),
    );
  }

  private getStoreCharacters(): Observable<MarvelCharacter[]> {
    return this.getStoreCharactersState().pipe(
      map((state: CharactersState) => state.summary as MarvelCharacter[]),
      filter((result: MarvelCharacter[]) => !!result),
    );
  }

  private getStoreCharactersState(): Observable<CharactersState> {
    return this.store.select(characters).pipe(
      filter((state: CharactersState) => state.state !== 'pending'),
      map((state: CharactersState) => {
        if (state.state === 'error') {
          throw state.error;
        }
        return state;
      }),
    );
  }

  private convertToCharacters(items: MarvelCharacter[]): Character[] {
    return items.map((item: MarvelCharacter) =>
      this.convertToCharacter(item),
    );
  }

  private convertToCharacter(item: MarvelCharacter): Character {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      thumbnail: {
        extension: item.thumbnail.extension,
        path: item.thumbnail.path,
      },
      comics: item.comics,
      events: item.events,
      series: item.series,
      stories: item.stories,
    };
  }
}
