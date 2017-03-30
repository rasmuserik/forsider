import React from 'react';
import Dialog from 'material-ui/Dialog';
import { ChromePicker } from 'react-color';
import ReCom from './ReCom'
import {store} from './store'

export default class Color extends ReCom {
  constructor(props) {
    super(props, store);
  }

  render() {
    let c = this.get(this.props.path, this.props.initialColor);
    return (
      <div>
        <Dialog
          {...this.props}
          style={{ width:300, }}
          bodyStyle={{ padding:0, }}
        >
        <ChromePicker
          color={c}
          onChangeComplete={(c) => this.set(this.props.path, c.rgb)}
        />
        </Dialog>
      </div>
    );
  }
}
