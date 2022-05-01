import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EMPTY, map, Observable, Subject, takeUntil} from "rxjs";
import {CharacterListService} from "../../services/character-list.service";
import {MarvelCharacter} from "@app-smart-test/entities";
import {Character} from "../../interfaces/character.interface";

@Component({
  selector: 'marvel-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit, OnDestroy {

  public model$: Observable<Character> = EMPTY;

  private readonly destroy$: Subject<void> = new Subject();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly characterListService: CharacterListService,
  ) { }

  public ngOnInit(): void {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.model$ = this.characterListService.getCharacter(+id).pipe(
      map((item: MarvelCharacter) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        thumbnail: {
          extension: item.thumbnail.extension,
          path: item.thumbnail.path,
        },
      })),
    );
  }

  public ngOnDestroy() {
    this.destroy$.next();
  }
}
