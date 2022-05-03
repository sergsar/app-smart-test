import {ComicsState} from "../interfaces/comics-state.interface";
import {createReducer, on} from "@ngrx/store";
import {
  loadCharacterComicsFailure,
  loadCharacterComicsSuccess
} from "../actions/comics.action";


const initialState: ComicsState = {
  state: 'pending',
};

export const comicsReducer = createReducer(
  initialState,
  on(
    loadCharacterComicsSuccess,
    (state: ComicsState, data: any): ComicsState => {
      return {
        state: 'ready',
        ...data,
      }
    },
  ),
  on(
    loadCharacterComicsFailure,
    (state: ComicsState): ComicsState => ({
      state: 'error',
    }),
  ),
);
