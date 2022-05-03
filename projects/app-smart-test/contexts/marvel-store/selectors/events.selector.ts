import {createSelector} from "@ngrx/store";
import {MARVEL_STORE_KEY} from "../const/marvel-store-key";
import {MarvelStore} from "../interfaces/marvel-store.interface";
import {EventsState} from "../interfaces/events-state.interface";

export const events = createSelector(
  (state: any): MarvelStore => state[MARVEL_STORE_KEY],
  (state: MarvelStore): EventsState => state.events,
);
