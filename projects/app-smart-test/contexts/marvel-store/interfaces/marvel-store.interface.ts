import {CharactersState} from "./characters-state.interface";
import {ComicsState} from "./comics-state.interface";
import {EventsState} from "./events-state.interface";
import {SeriesState} from "./series-state.interface";
import {StoriesState} from "./stories-state.interface";

export interface MarvelStore {
  characters: CharactersState;
  comics: ComicsState;
  events: EventsState;
  series: SeriesState;
  stories: StoriesState;
}
