import {BaseState} from "./base-state.interface";
import {MarvelEvent} from "@app-smart-test/entities";
import {KeyValueItems} from "./key-value-items.interface";

export interface EventsState extends BaseState {
  cache?: KeyValueItems<MarvelEvent>;
  summary?: KeyValueItems<MarvelEvent>;
}
