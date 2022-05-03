import {Component, Input, OnInit} from '@angular/core';
import {catchError, EMPTY, Observable, of} from "rxjs";
import {Event} from "../../interfaces/event.interface";
import {ListDimensions} from "../../classes/list-dimensions";
import {ViewportInfoService} from "../../services/viewport-info.service";
import {EventsListService} from "../../services/events-list.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'marvel-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {

  public characterId?: number;

  public dimensions: ListDimensions;

  public model$: Observable<Event[][]> = EMPTY;

  constructor(
    private readonly viewportInfoService: ViewportInfoService,
    private readonly eventsListService: EventsListService,
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
    this.model$ = this.eventsListService.getCharacterEventsNext(
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
