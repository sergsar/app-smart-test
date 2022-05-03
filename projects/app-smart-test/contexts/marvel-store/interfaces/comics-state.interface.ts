import {BaseState} from "./base-state.interface";
import {MarvelComics} from "@app-smart-test/entities";
import {KeyValueItems} from "./key-value-items.interface";

export interface ComicsState extends BaseState {
  summary?: KeyValueItems<MarvelComics>;
}
