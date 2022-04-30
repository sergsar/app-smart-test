import {ChangeDetectionStrategy, Component, HostListener, OnDestroy} from '@angular/core';
import {
  BehaviorSubject, catchError,
  debounceTime,
  Observable, of,
  Subject,
} from "rxjs";
import {
  CharacterListDimensions
} from "../../classes/character-list-dimensions";
import {Character} from "../../interfaces/character.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {CharacterListService} from "../../services/character-list.service";

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

  private loadNextCharacters$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly characterListService: CharacterListService,
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

    this.model$ = this.characterListService.getCharactersNext(
      this.dimensions,
      this.loadNextCharacters$,
    ).pipe(
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
        this.loadNextCharacters$.next();
      },
    );
  }

  @HostListener('document:scroll', ['$event'])
  public scroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 2 / 3) {
      this.endScroll$.next();
    }
  }

  public ngOnDestroy() {
    this.destroy$.next();
  }

  public click(cellId: string): void {
    this.router.navigate(
      ['character', cellId],
      { relativeTo: this.route.parent },
    );
  }
}
