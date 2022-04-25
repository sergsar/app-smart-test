export interface MarvelBaseItem {
  id: number;
}

export interface MarvelCharacter extends MarvelBaseItem {
  name: string;
}

export interface MarvelComics extends MarvelBaseItem {
  title: string;
}
