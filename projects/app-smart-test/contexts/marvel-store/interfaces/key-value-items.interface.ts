import {MarvelBaseItem} from "@app-smart-test/entities";

export interface KeyValueItems<T extends MarvelBaseItem> {
  [key: number]: T[],
}
