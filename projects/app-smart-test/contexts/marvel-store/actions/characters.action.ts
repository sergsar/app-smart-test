import {createAction, props} from "@ngrx/store";
import {MarvelCharacter} from "@app-smart-test/entities";
import {PaginationData} from "../interfaces/pagination-data";
import {BasePayload} from "../interfaces/payloads";

function createNsType(_ns: string): (s: string) => string {
  return (type: string): string => `${_ns} ${type}`;
}

type createNsFn = (key: string) => string;

const ns: createNsFn = createNsType('[MARVEL CHARACTERS]');

export const loadCharactersSuccess = createAction(
  ns('Load marvel characters success'),
  props<{ content: MarvelCharacter[], pagination: PaginationData }>(),
);
export const loadCharactersFailure = createAction(
  ns('Load marvel characters failure'),
  props<{ error: unknown }>(),
);
export const loadCharacters = createAction(
  ns('Load marvel characters'),
  props<BasePayload>(),
);
export const loadingCharacters = createAction(
  ns('Loading marvel characters'),
);
export const needReloadCharacters = createAction(
  ns('Need reload marvel characters'),
);
