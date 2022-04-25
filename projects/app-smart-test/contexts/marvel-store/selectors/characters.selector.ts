import {createSelector} from "@ngrx/store";
import {MarvelStore} from "../interfaces/marvel-store.interface";
import {MARVEL_STORE_KEY} from "../const/marvel-store-key";
import {CharactersState} from "../interfaces/characters-state.interface";

export const characters = createSelector(
  (state: any): MarvelStore => state[MARVEL_STORE_KEY],
  (state: MarvelStore): CharactersState => state.characters,
);
