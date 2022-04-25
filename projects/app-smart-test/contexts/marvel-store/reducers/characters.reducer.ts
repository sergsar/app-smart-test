import {createReducer, on} from "@ngrx/store";
import {loadCharactersFailure, loadCharactersSuccess, loadingCharacters} from "../actions/characters.action";
import {CharactersState} from "../interfaces/characters-state.interface";
import {MarvelCharacter} from "@app-smart-test/entities";
import {PaginationData} from "../interfaces/pagination-data";

const initialState: CharactersState = {
  state: 'pending',
};

export const charactersReducer = createReducer(
  initialState,
  on(
    loadCharactersSuccess,
    (state: CharactersState, data: { content: MarvelCharacter[], pagination: PaginationData }): CharactersState => ({
      state: 'ready',
      ...data,
    }),
  ),
  on(
    loadCharactersFailure,
    (state: CharactersState, data: { error: unknown }): CharactersState => ({
      state: 'error',
      error: data.error,
    }),
  ),
  on(
    loadingCharacters,
    (state: CharactersState, data: unknown): CharactersState => ({
      state: 'pending',
    }),
  ),
);
