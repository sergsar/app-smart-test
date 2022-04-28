import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-character-board',
  templateUrl: './character-board.component.html',
  styleUrls: ['./character-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterBoardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
