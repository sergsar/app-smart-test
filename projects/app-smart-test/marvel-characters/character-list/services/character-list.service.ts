import {Injectable} from "@angular/core";
import {MarvelCharacter} from "@app-smart-test/entities";
import {catchError, filter, map, Observable, of, switchMap} from "rxjs";
import {characters, CharactersState, loadCharacter, loadCharacters} from "@app-smart-test/contexts";
import {Character} from "../interfaces/character.interface";
import {
  CharacterListDimensions
} from "../classes/character-list-dimensions";
import {Store} from "@ngrx/store";

@Injectable()
export class CharacterListService {
  constructor(
    private readonly store: Store<any>,
  ) {
  }

  public getCharacter(id: number): Observable<MarvelCharacter> {
    this.store.dispatch(loadCharacter({ id }));
    return this.getStoreCharacter(id);
  }

  public getCharactersNext(
    dimensions: CharacterListDimensions,
    next$: Observable<void>,
  ): Observable<MarvelCharacter[][]> {
    let charactersAcc: MarvelCharacter[] = [];
    return next$.pipe(
      switchMap(() => {
        console.log(charactersAcc.length); // TODO: Исправить. Выстреливает 2 раза т.к. сначала идёт next и потом store
        this.store.dispatch(loadCharacters({
          offset: charactersAcc.length,
          limit: dimensions.cellsCount * dimensions.rowsCount,
        }));
        return this.getStoreCharacters().pipe(
          map((results: MarvelCharacter[]) => {
            charactersAcc = [...charactersAcc, ...results];

            const tree: Character[][] = [];
            const rowsCount: number = Math.ceil(charactersAcc.length / dimensions.cellsCount);
            for (let i = 0; i < rowsCount; i++) {
              const startIndex: number = dimensions.cellsCount * i;
              const row: MarvelCharacter[] = charactersAcc.slice(startIndex, startIndex + dimensions.cellsCount);
              const container: MarvelCharacter[] = new Array(dimensions.cellsCount);
              Object.assign(container, row);
              tree[i] = container.map((item: MarvelCharacter) => {
                return {
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  thumbnail: {
                    extension: item.thumbnail.extension,
                    path: item.thumbnail.path,
                  },
                };
              });
            }
            console.log('Characters');
            console.log(charactersAcc);
            return tree;
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
      map((state: CharactersState) => state.content as MarvelCharacter[]),
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
}
