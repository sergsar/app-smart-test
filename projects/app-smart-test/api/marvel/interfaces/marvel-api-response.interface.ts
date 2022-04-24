export interface MarvelApiResponse<T extends MarvelApiBaseResult> {
  data: MarvelApiResponseData<T>;
}

export interface MarvelApiResponseData<T extends MarvelApiBaseResult> {
  results: T[];
}

export interface MarvelApiBaseResult {
  id: number;
}

export interface MarvelCharacter extends MarvelApiBaseResult{
  name: string;
}

export interface MarvelComics extends MarvelApiBaseResult{
  title: string;
}
