export interface MarvelBaseItem {
  id: number;
}

export interface MarvelCharacter extends MarvelBaseItem {
  name: string;
  description: string;
  thumbnail: {
    extension: string,
    path: string,
  };
  comics: MarvelCollection;
  events: MarvelCollection;
  series: MarvelCollection;
  stories: MarvelCollection;
}

export interface MarvelComics extends MarvelBaseItem {
  title: string;
  description: string;
  thumbnail: {
    extension: string,
    path: string,
  };
}

export interface MarvelStory extends MarvelBaseItem {
  title: string;
  description: string;
  thumbnail: {
    extension: string,
    path: string,
  };
}

export interface MarvelEvent extends MarvelBaseItem {
  title: string;
  description: string;
  thumbnail: {
    extension: string,
    path: string,
  };
}

export interface MarvelSeries extends MarvelBaseItem {
  title: string;
  description: string;
  thumbnail: {
    extension: string,
    path: string,
  };
}

export interface MarvelCollection {
  items: unknown[],
}
