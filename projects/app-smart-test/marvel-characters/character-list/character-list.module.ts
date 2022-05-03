import {NgModule} from "@angular/core";
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterBoardComponent } from './components/character-board/character-board.component';
import {RouterModule, Routes} from "@angular/router";
import {MarvelStoreModule} from "@app-smart-test/contexts";
import { CharacterListItemComponent } from './components/character-list-item/character-list-item.component';
import {CommonModule} from "@angular/common";
import { CharacterComponent } from './components/character/character.component';
import {CharacterListService} from "@app-smart-test/marvel-characters/character-list/services/character-list.service";
import { ComicsListComponent } from './components/comics-list/comics-list.component';
import {ViewportInfoService} from "./services/viewport-info.service";
import {ComicsListService} from "./services/comics-list.service";
import { ComicsListItemComponent } from './components/comics-list-item/comics-list-item.component';
import {
  EventsListComponent
} from "./components/events-list/events-list.component";
import {EventsListService} from "./services/events-list.service";
import {StoriesListService} from "./services/stories-list.service";
import {SeriesListService} from "./services/series-list.service";
import {
  SeriesListComponent
} from "./components/series-list/series-list.component";
import {
  StoriesListComponent
} from "./components/stories-list/stories-list.component";
import {characterListRoutes} from "./character-list-routes";

const routers: Routes = characterListRoutes;

@NgModule({
  imports: [
    RouterModule.forChild(routers),
    MarvelStoreModule,
    CommonModule,
  ],
  declarations: [
    CharacterListComponent,
    CharacterBoardComponent,
    CharacterListItemComponent,
    CharacterComponent,
    ComicsListComponent,
    ComicsListItemComponent,
    EventsListComponent,
    SeriesListComponent,
    StoriesListComponent,
  ],
  providers: [
    CharacterListService,
    ViewportInfoService,
    ComicsListService,
    EventsListService,
    StoriesListService,
    SeriesListService,
  ],
})
export class CharacterListModule {

}
