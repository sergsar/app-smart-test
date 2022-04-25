import {PaginationData} from "./pagination-data";

export interface BaseState {
  state: 'pending' | 'ready' | 'error';
  pagination?: PaginationData;
  error?: unknown;
}
