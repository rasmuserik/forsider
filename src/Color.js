import React from 'react';
import Dialog from 'material-ui/Dialog';
import { ChromePicker } from 'react-color';
import ReCom from './ReCom'
import {store} from './store'

let colorStyle = {
  display: 'inline-block',
  overflow: 'hidden',
  height: 240,
  width: 225
}
export default class Color extends ReCom {
  constructor(props) {
    super(props, store);
  }

  render() {
    let c = this.get(this.props.path, this.props.initialColor);
    return (
      <div style={colorStyle}>
        <ChromePicker
          color={c}
          onChangeComplete={(c) => {
            this.set(this.props.path, c.rgb)
          }}
        />
      </div>
    );
  }
}
