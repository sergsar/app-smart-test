
export interface BaseState {
  state: 'pending' | 'ready' | 'error';
  error?: unknown;
}
