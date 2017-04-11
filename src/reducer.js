import Immutable from 'immutable';
import assert from 'assert';

export const SET_IN = 'SET_IN';

export function makePath(path) {
  if(typeof path === 'string') {
    path = path.split('.');
  }

  assert(Array.isArray(path));
  return path;
}

export let dispatchTable = {
  SET_IN: (state, action) => setIn(state, action.path, action.value)
}

export function reduce(state = new Immutable.Map(), action) {
  return (dispatchTable[action.type] || (state => state))(state, action);
}

function setIn(o, path, val) {
  path = makePath(path);

  if(path.length === 0) {
    return Immutable.fromJS(val);
  } 

  let key = path[0];
  path = path.slice(1);

  if(typeof key === 'string' ) {
    if(!(o instanceof Immutable.Map)) {
      o = new Immutable.Map();
    }
  } else if(typeof key === 'number') {
    if(!(o instanceof Immutable.List)) {
      o = new Immutable.List();
    }
  } else {
    assert(false);
  }

  return o.set(key, setIn(o.get(key), path, val));
}
