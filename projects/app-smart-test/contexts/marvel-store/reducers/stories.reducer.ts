import {StoriesState} from "../interfaces/stories-state.interface";
import {createReducer, on} from "@ngrx/store";
import {
  loadCharacterStoriesFailure,
  loadCharacterStoriesSuccess
} from "../actions/stories.action";


const initialState: StoriesState = {
  state: 'pending',
};

export const storiesReducer = createReducer(
  initialState,
  on(
    loadCharacterStoriesSuccess,
    (state: StoriesState, data: any): StoriesState => {
      return {
        state: 'ready',
        ...data,
      }
    },
  ),
  on(
    loadCharacterStoriesFailure,
    (state: StoriesState): StoriesState => ({
      state: 'error',
    }),
  ),
);
