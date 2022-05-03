import {SeriesState} from "../interfaces/series-state.interface";
import {createReducer, on} from "@ngrx/store";
import {
  loadCharacterSeriesFailure,
  loadCharacterSeriesSuccess
} from "../actions/series.action";


const initialState: SeriesState = {
  state: 'pending',
};

export const seriesReducer = createReducer(
  initialState,
  on(
    loadCharacterSeriesSuccess,
    (state: SeriesState, data: any): SeriesState => {
      return {
        state: 'ready',
        ...data,
      }
    },
  ),
  on(
    loadCharacterSeriesFailure,
    (state: SeriesState): SeriesState => ({
      state: 'error',
    }),
  ),
);
