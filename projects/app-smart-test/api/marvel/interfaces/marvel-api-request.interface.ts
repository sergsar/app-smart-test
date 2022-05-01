
export interface MarvelApiRequest {

}

export interface MarvelPaginatedRequestParams {
  limit?: number,
  offset?: number,
  orderBy?: string,
}

export interface MarvelRequestParams {
  id?: number,
}

export interface MarvelRequestAuthParams {
  ts: string,
  apikey: string,
  hash: string,
}
