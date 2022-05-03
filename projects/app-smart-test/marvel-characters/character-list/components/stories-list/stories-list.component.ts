import {Component, Input, OnInit} from '@angular/core';
import {catchError, EMPTY, Observable, of} from "rxjs";
import {Story} from "../../interfaces/story.interface";
import {ListDimensions} from "../../classes/list-dimensions";
import {ViewportInfoService} from "../../services/viewport-info.service";
import {StoriesListService} from "../../services/stories-list.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'marvel-stories-list',
  templateUrl: './stories-list.component.html',
  styleUrls: ['./stories-list.component.scss']
})
export class StoriesListComponent implements OnInit {

  public characterId?: number;

  public dimensions: ListDimensions;

  public model$: Observable<Story[][]> = EMPTY;

  constructor(
    private readonly viewportInfoService: ViewportInfoService,
    private readonly storiesListService: StoriesListService,
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
    this.model$ = this.storiesListService.getCharacterStoriesNext(
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
