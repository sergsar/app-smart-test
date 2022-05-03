import {BaseState} from "./base-state.interface";
import {MarvelSeries} from "@app-smart-test/entities";
import {KeyValueItems} from "./key-value-items.interface";

export interface SeriesState extends BaseState {
  cache?: KeyValueItems<MarvelSeries>;
  summary?: KeyValueItems<MarvelSeries>;
}
