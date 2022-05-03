import {MarvelCollection, MarvelComics, MarvelEvent, MarvelSeries} from "@app-smart-test/entities";

export interface Character {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    extension: string;
    path: string;
  };
  comics: MarvelCollection,
  events: MarvelCollection,
  stories: MarvelCollection,
  series: MarvelCollection,
}
