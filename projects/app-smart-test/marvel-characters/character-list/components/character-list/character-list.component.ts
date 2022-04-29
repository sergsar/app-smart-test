import {ChangeDetectionStrategy, Component, HostListener, OnDestroy} from '@angular/core';
import {debounceTime, filter, map, Subject, takeUntil} from "rxjs";
import {MarvelApiService} from "@app-smart-test/api";
import {Store} from "@ngrx/store";
import {characters, CharactersState, loadCharacters} from "@app-smart-test/contexts";
import {MarvelCharacter} from "@app-smart-test/entities";
import {
  CharacterListDimensions
} from "../../classes/character-list-dimensions";

@Component({
  selector: 'lib-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnDestroy {

  title = 'app-smart-test loading';

  public rows: any[];

  public get cells(): any[] {
    return new Array(this.dimensions.cellsCount);
  }

  public dimensions: CharacterListDimensions;

  private destroy$: Subject<void> = new Subject();

  private endScroll$: Subject<void> = new Subject();

  private loadCharacters$: Subject<void> = new Subject<void>();

  private characters: MarvelCharacter[] = [];

  constructor(
    private apiService: MarvelApiService,
    private readonly store: Store<any>,
  ) {
    this.dimensions = new CharacterListDimensions(
      document.body.clientWidth,
      window.innerHeight,
    );
    console.log('width: ', this.dimensions.width);
    console.log('height: ', this.dimensions.height);
    console.log('count: ', this.cells.length);
    const isMobile = (navigator as any)?.userAgentData?.mobile;
    console.log('mobile: ', isMobile);
    // this.cellMinWidth = isMobile ? 150 : 350;
    store.dispatch(loadCharacters({}));
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
        this.characters = results;
        console.log('Characters');
        console.log(this.characters.map(item => item));
      },
      (error) => {
        console.error(error);
        this.title = 'app-smart-test ERROR';
      }
    );

    // apiService.getComics('1011334', { limit: 10, offset: 10 }).pipe(
    //   takeUntil(this.destroy$),
    // ).subscribe(
    //   (result: MarvelApiResponse<MarvelComics>) => {
    //     console.log('Comics');
    //     console.log(result.data.results.map(item => item.title));
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );

    this.endScroll$.pipe(
      debounceTime(100),
    ).subscribe(
      () => {
        console.log('end scroll');
        this.loadCharacters$.next();
      },
    );

    this.rows = new Array(this.dimensions.rowsCount);
    this.loadCharacters$.subscribe(
      () => {
        this.store.dispatch(loadCharacters({
          offset: 20,
          limit: 10,
        }));
      }
    );

    // this.characters$ = of(null).pipe(
    //   switchMap(() => {
    //     const items: MarvelCharacter[] = [];
    //     return this.loadCharacters$.pipe(
    //       switchMap(() => {
    //
    //       }),
    //     )
    //   })
    // );
  }

  @HostListener('wheel', ['$event'])
  public wheel() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.endScroll$.next();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
