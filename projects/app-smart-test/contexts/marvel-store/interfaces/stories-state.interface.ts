import {BaseState} from "./base-state.interface";
import {MarvelStory} from "@app-smart-test/entities";
import {KeyValueItems} from "./key-value-items.interface";

export interface StoriesState extends BaseState {
  cache?: KeyValueItems<MarvelStory>;
  summary?: KeyValueItems<MarvelStory>;
}
