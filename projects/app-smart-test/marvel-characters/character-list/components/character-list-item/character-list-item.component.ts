import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Character} from "../../interfaces/character.interface";

@Component({
  selector: 'marvel-character-list-item',
  templateUrl: './character-list-item.component.html',
  styleUrls: ['./character-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListItemComponent implements OnInit {

  @Input()
  public model?: Character;

  constructor() {

  }

  ngOnInit(): void {

  }

}
