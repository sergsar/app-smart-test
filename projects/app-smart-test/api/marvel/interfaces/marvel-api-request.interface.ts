
export interface MarvelApiRequest {

}

export interface MarvelRequestParams {
  limit?: number,
  offset?: number,
}

export interface MarvelRequestAuthParams {
  ts: string,
  apikey: string,
  hash: string,
}
