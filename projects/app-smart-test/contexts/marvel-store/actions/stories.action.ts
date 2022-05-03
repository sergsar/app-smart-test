import {createAction, props} from "@ngrx/store";
import {PaginatedSinglePayload} from "../interfaces/payloads";
import {KeyValueItems} from "../interfaces/key-value-items.interface";
import {MarvelStory} from "@app-smart-test/entities";

function createNsType(_ns: string): (s: string) => string {
  return (type: string): string => `${_ns} ${type}`;
}

type createNsFn = (key: string) => string;

const ns: createNsFn = createNsType('[MARVEL STORIES]');

export const loadCharacterStoriesSuccess = createAction(
  ns('Load marvel character stories success'),
  props<{
    summary: KeyValueItems<MarvelStory>,
  }>(),
);
export const loadCharacterStoriesFailure = createAction(
  ns('Load marvel character stories failure'),
  props<{
    error: unknown,
  }>(),
);
export const loadCharacterStories = createAction(
  ns('Load marvel character stories'),
  props<PaginatedSinglePayload>(),
);

