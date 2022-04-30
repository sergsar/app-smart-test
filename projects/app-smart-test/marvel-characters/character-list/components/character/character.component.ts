import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {characters, CharactersState} from "@app-smart-test/contexts";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'marvel-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<any>,
  ) { }

  public ngOnInit(): void {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id')!;
    console.log('id: ', id);
    this.store.select(characters).pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      (state: CharactersState) => console.log(state),
    );
  }

  public ngOnDestroy() {
    this.destroy$.next();
  }
}
