import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, ContentChild,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  BehaviorSubject, catchError, debounceTime, delay,
  EMPTY, filter, fromEvent, interval, map,
  Observable, of,
  Subject, takeUntil,
} from "rxjs";
import {
  ListDimensions
} from "../../classes/list-dimensions";
import {Character} from "../../interfaces/character.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {CharacterListService} from "../../services/character-list.service";
import {ViewportInfoService} from "../../services/viewport-info.service";

@Component({
  selector: 'marvel-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnDestroy {
  public dimensions: ListDimensions;

  public model$: Observable<Character[][]>;

  private destroy$: Subject<void> = new Subject();

  private loadNextCharacters$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);

  private endScroll?: boolean;

  @ViewChild('list', { read: ElementRef })
  public list?: ElementRef<HTMLElement>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly characterListService: CharacterListService,
    private readonly viewportInfoService: ViewportInfoService,
  ) {
    const isPortrait = viewportInfoService.isPortrait;

    this.dimensions = new ListDimensions(
      isPortrait ? 1 : 4,
      isPortrait ? 2 : 1,
    );


    this.model$ = this.characterListService.getCharactersNext(
      this.dimensions,
      this.loadNextCharacters$,
    ).pipe(
      catchError((err) => {
        console.error(err);
        return of([]);
      }),
    );

    interval(0).pipe(
      takeUntil(this.destroy$),
      map(() => {
        if (!this.list?.nativeElement) {
          return;
        }
        const element: HTMLElement = this.list?.nativeElement!;
        const diff: number = element.scrollHeight - element.clientHeight - element.scrollTop;
        const endScroll = diff < 100;
        if (endScroll && !this.endScroll) {
          this.endScroll = endScroll;
          this.loadNextCharacters$.next();
        }
        if (!endScroll) {
          this.endScroll = endScroll;
        }
      }),
    ).subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next();
  }

  public click(cellId: number): void {
    this.router.navigate(
      ['character', cellId],
      { relativeTo: this.route.parent },
    );
  }
}
