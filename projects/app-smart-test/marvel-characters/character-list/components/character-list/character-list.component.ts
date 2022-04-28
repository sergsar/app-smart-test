import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {filter, map, Subject, takeUntil} from "rxjs";
import {MarvelApiResponse, MarvelApiService} from "@app-smart-test/api";
import {Store} from "@ngrx/store";
import {characters, CharactersState, loadCharacters} from "@app-smart-test/contexts";
import {MarvelCharacter, MarvelComics} from "@app-smart-test/entities";

@Component({
  selector: 'lib-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnDestroy {

  title = 'app-smart-test loading';

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: MarvelApiService,
    private readonly store: Store<any>
  ) {
    store.dispatch(loadCharacters({ offset: 10, limit: 5 }));
    store.select(characters).pipe(
      takeUntil(this.destroy$),
      map((state: CharactersState) => {
        console.log('state: ', state);
        if (state.state === 'error') {
          throw state.error;
        }
        this.title = `app-smart-test characters ${state.state === 'pending' ? 'pending' : 'complete'}`
        return state.content as MarvelCharacter[];
      }),
      filter(Boolean),
    ).subscribe(
      (results: MarvelCharacter[]) => {
        console.log('Characters')
        console.log(results.map(item => item.name));
      },
      (error) => {
        console.error(error);
        this.title = 'app-smart-test ERROR';
      }
    );

    apiService.getComics('1011334', { limit: 10, offset: 10 }).pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      (result: MarvelApiResponse<MarvelComics>) => {
        console.log('Comics');
        console.log(result.data.results.map(item => item.title));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  load() {
    this.store.dispatch(loadCharacters({}));
  }
}
