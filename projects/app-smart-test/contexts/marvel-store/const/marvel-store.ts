import {InjectionToken} from "@angular/core";
import {Action, ActionReducerMap} from "@ngrx/store";
import {MarvelStore} from "../interfaces/marvel-store.interface";
import {charactersReducer} from "../reducers/characters.reducer";

export const MARVEL_STORE = new InjectionToken<any>('Marvel Api', {
  factory: () => ({
    characters: charactersReducer,
  }) as ActionReducerMap<MarvelStore, Action>
});
