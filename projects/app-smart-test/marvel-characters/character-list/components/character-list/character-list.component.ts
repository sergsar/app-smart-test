import {ChangeDetectionStrategy, Component, HostListener, OnDestroy} from '@angular/core';
import {BehaviorSubject, catchError, debounceTime, filter, map, Observable, of, Subject, takeUntil} from "rxjs";
import {MarvelApiService} from "@app-smart-test/api";
import {Store} from "@ngrx/store";
import {characters, CharactersState, loadCharacters} from "@app-smart-test/contexts";
import {MarvelCharacter} from "@app-smart-test/entities";
import {
  CharacterListDimensions
} from "../../classes/character-list-dimensions";
import {Character} from "../../interfaces/character.interface";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'marvel-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnDestroy {
  public dimensions: CharacterListDimensions;

  public model$: Observable<Character[][]>;

  private destroy$: Subject<void> = new Subject();

  private endScroll$: Subject<void> = new Subject();

  private loadCharacters$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);

  private characters: MarvelCharacter[] = [];

  constructor(
    private readonly apiService: MarvelApiService,
    private readonly store: Store<any>,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    const isMobile = (navigator as any)?.userAgentData?.mobile;
    console.log('mobile: ', isMobile);
    this.dimensions = new CharacterListDimensions(
      document.body.clientWidth,
      window.innerHeight,
      isMobile ? 350 : 350,
    );
    console.log('width: ', this.dimensions.width);
    console.log('height: ', this.dimensions.height);
    console.log('count: ', this.dimensions.cellsCount);

    this.model$ = store.select(characters).pipe(
      map((state: CharactersState) => {
        console.log('state: ', state);
        if (state.state === 'error') {
          throw state.error;
        }
        return state.content as MarvelCharacter[];
      }),
      filter(Boolean),
      map((results: MarvelCharacter[]) => {
        this.characters = [...this.characters, ...results];

        const tree: Character[][] = [];
        const rowsCount: number = Math.ceil(this.characters.length / this.dimensions.cellsCount);
        for (let i = 0; i < rowsCount; i++) {
          const startIndex: number = this.dimensions.cellsCount * i;
          const row: MarvelCharacter[] = this.characters.slice(startIndex, startIndex + this.dimensions.cellsCount);
          const container: MarvelCharacter[] = new Array(this.dimensions.cellsCount);
          Object.assign(container, row);
          tree[i] = container.map((item: MarvelCharacter) => {
            return {
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
        console.log(this.characters);
        return tree;
      }),
      catchError((err) => {
        console.error(err);
        return of([]);
      }),
    );

    this.endScroll$.pipe(
      debounceTime(100),
    ).subscribe(
      () => {
        console.log('end scroll');
        this.loadCharacters$.next();
      },
    );

    this.loadCharacters$.subscribe(
      () => {
        this.dispatchLoadNext();
      }
    );
  }

  @HostListener('document:scroll', ['$event'])
  public wheel() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 2 / 3) {
      this.endScroll$.next();
    }
  }

  public ngOnDestroy() {
    this.destroy$.next();
  }

  public click(): void {

  }

  private dispatchLoadNext() {
    this.store.dispatch(loadCharacters({
      offset: this.characters.length,
      limit: this.dimensions.cellsCount * this.dimensions.rowsCount,
    }));
  }
}
