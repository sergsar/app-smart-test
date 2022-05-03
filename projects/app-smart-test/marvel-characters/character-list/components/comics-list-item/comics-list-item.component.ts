import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Comics} from "../../interfaces/comics.interface";

@Component({
  selector: 'marvel-comics-list-item',
  templateUrl: './comics-list-item.component.html',
  styleUrls: ['./comics-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComicsListItemComponent implements OnInit {

  @Input()
  model?: Comics;

  constructor() { }

  ngOnInit(): void {

  }

}
