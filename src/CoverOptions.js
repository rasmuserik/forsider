import React from 'react';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';

import ReCom from './ReCom.js';
import {store} from './store.js';
import {installedFonts} from 'installed-fonts';

import ImageUpload from './ImageUpload.js';
import Color from './Color.js';

let fonts = [];
installedFonts().then(o => fonts = o);

export default class CoverOptions extends ReCom {
  constructor(props, context) {
    super(props, store);
  }

  render() {
    let currentImage = this.get('currentImage', this.get(['images', 0, 'id']));
    let optionPath = name => ['options', currentImage, name];
    let bg = this.get(optionPath('background'), {r:50,g:50,b:100,a:0.2});

    return <div>
          <ImageUpload /><br/>
          <RaisedButton 
            backgroundColor={`rgba(${bg.r},${bg.g},${bg.b},${bg.a})`}
            label="Baggrundsfarve"
            onTouchTap={() => this.set('ui.backgroundDialog', true)} />
          <Color 
            open={this.get('ui.backgroundDialog', false)}
            path={optionPath('background')}
            onRequestClose={() => this.set('ui.backgroundDialog', false)}
          />

        <div>
          <label htmlFor="fontScale" 
            style={{
              display: 'inline-block',
              marginTop: '20px',
              fontSize: 12,
              color: 'rgba(0,0,0,0.3)',
            }}>
            Font skala
          </label>
          <Slider
            id="fontScale"
            type="number" 
            style={{
              marginTop: -10,
              height:10,
              marginBottom: 10,
            }}
            max={100}
            min={1}
            step={1}
            value={this.get(optionPath('fontScale'), 50)}
            onChange={(_,val) => this.set(optionPath('fontScale'), val)}
          />
        </div>

        <div>
          <label htmlFor="yPos" 
            style={{
              display: 'inline-block',
              marginTop: '20px',
              fontSize: 12,
              color: 'rgba(0,0,0,0.3)',
            }}>
            Afstand fra toppen
          </label>
          <Slider
            id="yPos"
            type="number" 
            style={{
              marginTop: -10,
              height:10,
              marginBottom: 10,
            }}
            max={100}
            min={0}
            step={1}
            value={this.get(optionPath('yPos'), 20)}
            onChange={(_,val) => this.set(optionPath('yPos'), val)}
          />
        </div>
        <div>
          <TextField 
            floatingLabelText="Maksimal tekstlængde"
            type="number" 
            max={300}
            min={0}
            step={1}
            value={this.get(optionPath('maxLen'), 30)}
            onChange={(_,val) => this.set(optionPath('maxLen'), val)}
          />
        </div>

        <div>
          <AutoComplete
            searchText={this.get(optionPath('font'))}
            onUpdateInput={(val) => this.set(optionPath('font'), val)}
            floatingLabelText="Font"
            filter={AutoComplete.fuzzyFilter}
            dataSource={fonts}
            maxSearchResults={20}
          />
        </div>
      </div>
  }
}
