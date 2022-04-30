
export interface MarvelApiRequest {

}

export interface MarvelRequestParams {
  limit?: number,
  offset?: number,
  orderBy?: string,
}

export interface MarvelRequestAuthParams {
  ts: string,
  apikey: string,
  hash: string,
}
