import {InjectionToken} from "@angular/core";
import {Action, ActionReducerMap} from "@ngrx/store";
import {MarvelStore} from "../interfaces/marvel-store.interface";
import {charactersReducer} from "../reducers/characters.reducer";
import {comicsReducer} from "../reducers/comics.reducer";
import {eventsReducer} from "../reducers/events.reducer";
import {seriesReducer} from "../reducers/series.reducer";
import {storiesReducer} from "../reducers/stories.reducer";

export const MARVEL_STORE = new InjectionToken<any>('Marvel Api', {
  factory: () => ({
    characters: charactersReducer,
    comics: comicsReducer,
    events: eventsReducer,
    series: seriesReducer,
    stories: storiesReducer,
  }) as ActionReducerMap<MarvelStore, Action>
});
