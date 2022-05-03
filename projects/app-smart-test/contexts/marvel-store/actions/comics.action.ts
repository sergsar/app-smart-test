import {createAction, props} from "@ngrx/store";
import {MarvelComics} from "@app-smart-test/entities";
import {PaginatedSinglePayload} from "../interfaces/payloads";
import {KeyValueItems} from "../interfaces/key-value-items.interface";

function createNsType(_ns: string): (s: string) => string {
  return (type: string): string => `${_ns} ${type}`;
}

type createNsFn = (key: string) => string;

const ns: createNsFn = createNsType('[MARVEL COMICS]');

export const loadCharacterComicsSuccess = createAction(
  ns('Load marvel character comics success'),
  props<{
    summary: KeyValueItems<MarvelComics>,
  }>(),
);
export const loadCharacterComicsFailure = createAction(
  ns('Load marvel character comics failure'),
  props<{
    error: unknown,
  }>(),
);
export const loadCharacterComics = createAction(
  ns('Load marvel character comics'),
  props<PaginatedSinglePayload>(),
);

