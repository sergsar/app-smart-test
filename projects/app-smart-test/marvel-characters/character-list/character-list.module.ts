import {NgModule} from "@angular/core";
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterBoardComponent } from './components/character-board/character-board.component';
import {RouterModule, Routes} from "@angular/router";
import {MarvelStoreModule} from "@app-smart-test/contexts";
import { CharacterListItemComponent } from './components/character-list-item/character-list-item.component';
import {CommonModule} from "@angular/common";

const routers: Routes = [
  {
    path: '',
    component: CharacterBoardComponent,
    children: [
      {
        path: 'character-list',
        component: CharacterListComponent,
      },
      {path: 'character/:id', component: CharacterListItemComponent },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'character-list',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routers),
    MarvelStoreModule,
    CommonModule,
  ],
  declarations: [
    CharacterListComponent,
    CharacterBoardComponent,
    CharacterListItemComponent
  ],
})
export class CharacterListModule {

}
