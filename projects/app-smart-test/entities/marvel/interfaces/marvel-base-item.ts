export interface MarvelBaseItem {
  id: string;
}

export interface MarvelCharacter extends MarvelBaseItem {
  name: string;
  description: string;
  thumbnail: {
    extension: string,
    path: string,
  };
}

export interface MarvelComics extends MarvelBaseItem {
  title: string;
}
