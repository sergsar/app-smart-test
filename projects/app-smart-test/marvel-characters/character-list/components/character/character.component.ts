import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EMPTY, Observable, Subject} from "rxjs";
import {CharacterListService} from "../../services/character-list.service";
import {Character} from "../../interfaces/character.interface";

@Component({
  selector: 'marvel-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterComponent implements OnInit, OnDestroy {

  public model$: Observable<Character> = EMPTY;

  public id?: number;

  private readonly destroy$: Subject<void> = new Subject();

  get tab(): string {
    return this.route.firstChild?.snapshot?.url[0].path!;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly characterListService: CharacterListService,
  ) { }

  public ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.model$ = this.characterListService.getCharacter(this.id);
  }

  public ngOnDestroy() {
    this.destroy$.next();
  }

  public changeList(path: string): Promise<boolean> {
    return this.router.navigate([path], { relativeTo: this.route })
  }

  public home(): Promise<boolean> {
    return this.router.navigate(['']);
  }
}
