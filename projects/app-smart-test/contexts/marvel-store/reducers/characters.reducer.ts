import {createReducer, on} from "@ngrx/store";
import {loadCharactersFailure, loadCharactersSuccess} from "../actions/characters.action";
import {CharactersState} from "../interfaces/characters-state.interface";

const initialState: CharactersState = {
  state: 'pending',
};

export const charactersReducer = createReducer(
  initialState,
  on(
    loadCharactersSuccess,
    (state: CharactersState, data: any): CharactersState => {
      return {
        state: 'ready',
        ...data,
      };
    },
  ),
  on(
    loadCharactersFailure,
    (state: CharactersState): CharactersState => ({
      state: 'error',
    }),
  ),
);
