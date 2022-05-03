import {Routes} from "@angular/router";
import {
  CharacterBoardComponent
} from "./components/character-board/character-board.component";
import {
  CharacterListComponent
} from "./components/character-list/character-list.component";
import {
  CharacterComponent
} from "./components/character/character.component";
import {
  ComicsListComponent
} from "./components/comics-list/comics-list.component";
import {
  EventsListComponent
} from "./components/events-list/events-list.component";
import {
  SeriesListComponent
} from "./components/series-list/series-list.component";
import {
  StoriesListComponent
} from "./components/stories-list/stories-list.component";

export const characterListRoutes: Routes = [
  {
    path: '',
    component: CharacterBoardComponent,
    children: [
      {
        path: 'character-list',
        component: CharacterListComponent,
      },
      {
        path: 'character/:id',
        component: CharacterComponent,
        children: [
          {
            path: 'comics',
            component: ComicsListComponent,
          },
          {
            path: 'events',
            component: EventsListComponent,
          },
          {
            path: 'series',
            component: SeriesListComponent,
          },
          {
            path: 'stories',
            component: StoriesListComponent,
          },
          {
            path: '**',
            pathMatch: 'full',
            redirectTo: 'comics',
          }
        ],
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'character-list',
      },
    ],
  },
];
