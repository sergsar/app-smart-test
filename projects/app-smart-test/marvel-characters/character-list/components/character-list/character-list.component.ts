import {ChangeDetectionStrategy, Component, HostListener, OnDestroy} from '@angular/core';
import {BehaviorSubject, debounceTime, filter, map, Subject, takeUntil} from "rxjs";
import {MarvelApiResponse, MarvelApiService} from "@app-smart-test/api";
import {Store} from "@ngrx/store";
import {characters, CharactersState, loadCharacters} from "@app-smart-test/contexts";
import {MarvelCharacter, MarvelComics} from "@app-smart-test/entities";

@Component({
  selector: 'lib-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnDestroy {

  title = 'app-smart-test loading';

  public rows: any[];

  public get width(): number {
    return document.body.clientWidth;
  }

  public get height(): number {
    return window.innerHeight;
  }

  public get cellsCount(): number {
    return Math.floor(this.width / this.cellMinWidth) || 1;
  }

  public get rowsCount(): number {
    const aspect: number = this.cellWidth / this.cellHeight;
    const height: number = this.cellMinWidth / aspect;
    return Math.ceil(this.height / height) + 1;
  }

  public get rowHeight(): number {
    const aspect: number = this.cellWidth / this.cellHeight;
    return this.cellMinWidth / aspect;
  }

  public get cells(): any[] {
    return new Array(this.cellsCount);
  }

  private cellWidth: number = 3;
  private cellHeight: number = 5;
  public readonly cellMinWidth: number = 350;

  private destroy$: Subject<void> = new Subject();

  private endScroll$: Subject<void> = new Subject();

  private loadCharacters$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);

  private characters: MarvelCharacter[] = [];

  constructor(
    private apiService: MarvelApiService,
    private readonly store: Store<any>,
  ) {
    console.log('width: ', this.width);
    console.log('height: ', this.height);
    console.log('count: ', this.cells.length);
    const isMobile = (navigator as any)?.userAgentData?.mobile;
    console.log('mobile: ', isMobile);
    // this.cellMinWidth = isMobile ? 150 : 350;
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
        this.characters = [...this.characters, ...results.map(item => item)];
        console.log('Characters');
        console.log(this.characters.map(item => item));
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

    this.endScroll$.pipe(
      debounceTime(100),
    ).subscribe(
      () => {
        console.log('end scroll');
        this.loadCharacters$.next();
      },
    );

    this.rows = new Array(this.rowsCount);
    this.loadCharacters$.subscribe(
      () => {
        this.store.dispatch(loadCharacters({
          offset: this.characters.length,
          limit: 10,
        }));
      }
    )
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

  load() {
    this.store.dispatch(loadCharacters({}));
  }
}
