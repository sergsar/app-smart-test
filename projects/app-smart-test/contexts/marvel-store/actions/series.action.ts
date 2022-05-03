import {createAction, props} from "@ngrx/store";
import {PaginatedSinglePayload} from "../interfaces/payloads";
import {KeyValueItems} from "../interfaces/key-value-items.interface";
import {MarvelSeries} from "@app-smart-test/entities";

function createNsType(_ns: string): (s: string) => string {
  return (type: string): string => `${_ns} ${type}`;
}

type createNsFn = (key: string) => string;

const ns: createNsFn = createNsType('[MARVEL SERIES]');

export const loadCharacterSeriesSuccess = createAction(
  ns('Load marvel character series success'),
  props<{
    summary: KeyValueItems<MarvelSeries>,
  }>(),
);
export const loadCharacterSeriesFailure = createAction(
  ns('Load marvel character series failure'),
  props<{
    error: unknown,
  }>(),
);
export const loadCharacterSeries = createAction(
  ns('Load marvel character series'),
  props<PaginatedSinglePayload>(),
);

