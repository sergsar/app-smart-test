import {Component, Input, OnInit} from '@angular/core';
import {catchError, EMPTY, Observable, of} from "rxjs";
import {Series} from "../../interfaces/series.interface";
import {ListDimensions} from "../../classes/list-dimensions";
import {ViewportInfoService} from "../../services/viewport-info.service";
import {SeriesListService} from "../../services/series-list.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'marvel-series-list',
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.scss']
})
export class SeriesListComponent implements OnInit {

  public characterId?: number;

  public dimensions: ListDimensions;

  public model$: Observable<Series[][]> = EMPTY;

  constructor(
    private readonly viewportInfoService: ViewportInfoService,
    private readonly seriesListService: SeriesListService,
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
    this.model$ = this.seriesListService.getCharacterSeriesNext(
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
