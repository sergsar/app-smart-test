import {createSelector} from "@ngrx/store";
import {MARVEL_STORE_KEY} from "../const/marvel-store-key";
import {MarvelStore} from "../interfaces/marvel-store.interface";
import {StoriesState} from "../interfaces/stories-state.interface";

export const stories = createSelector(
  (state: any): MarvelStore => state[MARVEL_STORE_KEY],
  (state: MarvelStore): StoriesState => state.stories,
);
