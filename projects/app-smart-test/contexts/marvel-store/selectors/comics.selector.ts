import {createSelector} from "@ngrx/store";
import {MARVEL_STORE_KEY} from "../const/marvel-store-key";
import {MarvelStore} from "../interfaces/marvel-store.interface";
import {ComicsState} from "../interfaces/comics-state.interface";

export const comics = createSelector(
  (state: any): MarvelStore => state[MARVEL_STORE_KEY],
  (state: MarvelStore): ComicsState => state.comics,
);
