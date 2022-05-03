export interface PaginatedPayload {
  offset?: number;
  limit?: number;
}

export interface PaginatedSinglePayload extends PaginatedPayload, SinglePayload {}

export interface SinglePayload {
  id: number;
}
