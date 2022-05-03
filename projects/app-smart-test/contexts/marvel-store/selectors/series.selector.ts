import {createSelector} from "@ngrx/store";
import {MARVEL_STORE_KEY} from "../const/marvel-store-key";
import {MarvelStore} from "../interfaces/marvel-store.interface";
import {SeriesState} from "../interfaces/series-state.interface";

export const series = createSelector(
  (state: any): MarvelStore => state[MARVEL_STORE_KEY],
  (state: MarvelStore): SeriesState => state.series,
);
