import { createStore } from 'redux'
import { reduce } from './reducer.js'

export const store = createStore(reduce);

export function dispatch(action) {
  return store.dispatch(action);
}
export function getState() {
  return store.getState();
}
