import {MarvelCharacter} from "@app-smart-test/entities";
import {BaseState} from "./base-state.interface";

export interface CharactersState extends BaseState{
  content?: MarvelCharacter[];
  summary?: MarvelCharacter[];
  cache?: MarvelCharacter[];
}
