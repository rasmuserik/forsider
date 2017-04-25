import React from 'react';
import {SET_IN, makePath} from './reducer.js';
import Immutable from 'immutable';
import _ from 'lodash';

export default class ReCom extends React.Component {
  constructor(props, store) {
    super(props);
    this.store = store;
    this.dependencies = new Map();
  }

  dispatch(o) {
    this.store.dispatch(o);
  }
  get(path, defaultValue) {
    path = makePath(path);
    let result;
    try {
      result = this.store.getState().getIn(path);
    } catch (e) {
      result = undefined;
    }

    if (this.accessed instanceof Map) {
      this.accessed.set(path, result);
    }

    if (Immutable.isImmutable(result)) {
      result = result.toJS();
    }

    if (result === undefined) {
      result = defaultValue;
    }

    return result;
  }

  set(path, value) {
    this.dispatch({type: SET_IN, path, value});
  }

  componentWillUpdate() {
    this.accessed = new Map();
  }

  componentDidUpdate() {
    this.dependencies = this.accessed;
    this.accessed = undefined;
  }

  shouldComponentUpdate(props, state) {
    if (!_.isEqual(props, this.props)) {
      return true;
    }
    if (!_.isEqual(state, this.state)) {
      return true;
    }
    for (let [path, val] of this.dependencies) {
      try {
        if (!Immutable.is(val, this.store.getState().getIn(path))) {
          return true;
        }
      } catch (e) {
        // do nothing
      }
    }
    return false;
  }

  componentWillMount() {
    this.accessed = new Map();
  }

  componentDidMount() {
    this.dependencies = this.accessed;
    this.accessed = undefined;
    this.unsubscribe = this.store.subscribe(() => this.setState({}));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
}
