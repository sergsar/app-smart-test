import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
