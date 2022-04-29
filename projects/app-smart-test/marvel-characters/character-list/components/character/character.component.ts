import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Character} from "../../interfaces/character.interface";

@Component({
  selector: 'marvel-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterComponent implements OnInit {

  @Input()
  public model?: Character;

  constructor() {

  }

  ngOnInit(): void {

  }

}
