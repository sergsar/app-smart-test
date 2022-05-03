import {Component, Input, OnInit} from '@angular/core';
import {catchError, EMPTY, Observable, of} from "rxjs";
import {Comics} from "../../interfaces/comics.interface";
import {ListDimensions} from "../../classes/list-dimensions";
import {ViewportInfoService} from "../../services/viewport-info.service";
import {ComicsListService} from "../../services/comics-list.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'marvel-comics-list',
  templateUrl: './comics-list.component.html',
  styleUrls: ['./comics-list.component.scss']
})
export class ComicsListComponent implements OnInit {

  public characterId?: number;

  public dimensions: ListDimensions;

  public model$: Observable<Comics[][]> = EMPTY;

  constructor(
    private readonly viewportInfoService: ViewportInfoService,
    private readonly comicsListService: ComicsListService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    const isPortrait = viewportInfoService.isPortrait;
    this.dimensions = new ListDimensions(
      isPortrait ? 1 : 4,
      isPortrait ? 2 : 1,
    );

    this.characterId = +this.activatedRoute.parent?.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.model$ = this.comicsListService.getCharacterComicsNext(
      this.characterId!,
      this.dimensions,
      of(void 0),
    ).pipe(
      catchError((err) => {
        console.error(err);
        return of([]);
      }),
    );
  }

}
