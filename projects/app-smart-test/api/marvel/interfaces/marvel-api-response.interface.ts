import {MarvelBaseItem} from "@app-smart-test/entities";

export interface MarvelApiResponse<T extends MarvelBaseItem> {
  data: MarvelApiResponseData<T>;
}

export interface MarvelApiResponseData<T extends MarvelBaseItem> {
  results: T[];
  count: number;
  limit: number;
  offset: number;
  total: number;
}
