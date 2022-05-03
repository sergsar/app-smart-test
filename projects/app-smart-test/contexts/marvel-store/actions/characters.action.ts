import {createAction, props} from "@ngrx/store";
import {MarvelCharacter} from "@app-smart-test/entities";
import {PaginatedPayload, SinglePayload} from "../interfaces/payloads";

function createNsType(_ns: string): (s: string) => string {
  return (type: string): string => `${_ns} ${type}`;
}

type createNsFn = (key: string) => string;

const ns: createNsFn = createNsType('[MARVEL CHARACTERS]');

export const loadCharactersSuccess = createAction(
  ns('Load marvel characters success'),
  props<{
    summary: MarvelCharacter[],
    single: MarvelCharacter[],
  }>(),
);
export const loadCharactersFailure = createAction(
  ns('Load marvel characters failure'),
  props<{
    error: unknown,
  }>(),
);
export const loadCharacters = createAction(
  ns('Load marvel characters'),
  props<PaginatedPayload>(),
);

export const loadCharacter = createAction(
  ns('Load marvel character'),
  props<SinglePayload>(),
);
