import {EventsState} from "../interfaces/events-state.interface";
import {createReducer, on} from "@ngrx/store";
import {
  loadCharacterEventsFailure,
  loadCharacterEventsSuccess
} from "../actions/events.action";


const initialState: EventsState = {
  state: 'pending',
};

export const eventsReducer = createReducer(
  initialState,
  on(
    loadCharacterEventsSuccess,
    (state: EventsState, data: any): EventsState => {
      return {
        state: 'ready',
        ...data,
      }
    },
  ),
  on(
    loadCharacterEventsFailure,
    (state: EventsState): EventsState => ({
      state: 'error',
    }),
  ),
);
