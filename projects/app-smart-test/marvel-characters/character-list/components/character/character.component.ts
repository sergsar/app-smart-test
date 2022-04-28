import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Character} from "../../interfaces/character.interface";

@Component({
  selector: 'lib-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterComponent implements OnInit {

  @Input()
  public model?: Character;

  constructor() {
    this.model = {
      name: 'Character Name',
      description: 'AIM is a terrorist organization bent on destroying the world.',
      thumbnail: {
        extension: 'jpg',
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/6/20/52602f21f29ec/portrait_fantastic.jpg',
      },
    }
  }

  ngOnInit(): void {
  }

}
