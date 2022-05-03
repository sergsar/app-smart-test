import {createAction, props} from "@ngrx/store";
import {PaginatedSinglePayload} from "../interfaces/payloads";
import {KeyValueItems} from "../interfaces/key-value-items.interface";
import {MarvelEvent} from "@app-smart-test/entities";

function createNsType(_ns: string): (s: string) => string {
  return (type: string): string => `${_ns} ${type}`;
}

type createNsFn = (key: string) => string;

const ns: createNsFn = createNsType('[MARVEL EVENTS]');

export const loadCharacterEventsSuccess = createAction(
  ns('Load marvel character events success'),
  props<{
    summary: KeyValueItems<MarvelEvent>,
  }>(),
);
export const loadCharacterEventsFailure = createAction(
  ns('Load marvel character events failure'),
  props<{
    error: unknown,
  }>(),
);
export const loadCharacterEvents = createAction(
  ns('Load marvel character events'),
  props<PaginatedSinglePayload>(),
);

