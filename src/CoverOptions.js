import React from 'react';
import {ReCom} from 'recom';
import {installedFonts} from 'installed-fonts';

import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';

import ImageUpload from './ImageUpload';
import Color from './Color';

let fonts = [];
installedFonts().then(o => (fonts = o));

export default class CoverOptions extends ReCom {
  constructor(props, context) {
    super(props);
  }

  render() {
    let currentImage = this.props.currentImage || '';
    let optionPath = name => ['options', currentImage, name];

    return (
      <div>
        <ImageUpload /><br />

        <div style={{display: 'inline-block', textAlign: 'center'}}>
          Baggrundsfarve <br />
          <Color path={optionPath('background')} />
        </div>&nbsp;&nbsp;&nbsp;&nbsp;

        <div style={{display: 'inline-block', textAlign: 'center'}}>
          Tekstfarve<br />
          <Color path={optionPath('textColor')} />
        </div>

        <div>
          <label
            htmlFor="fontScale"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              fontSize: 12,
              color: 'rgba(0,0,0,0.3)'
            }}>
            Font skala
          </label>
          <Slider
            id="fontScale"
            type="number"
            style={{
              marginTop: -10,
              height: 10,
              marginBottom: 10
            }}
            max={100}
            min={1}
            step={1}
            value={this.get(optionPath('fontScale'), 50)}
            onChange={(_, val) =>
              this.set(optionPath('fontScale'), val)}
          />
        </div>

        <div>
          <label
            htmlFor="yPos"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              fontSize: 12,
              color: 'rgba(0,0,0,0.3)'
            }}>
            Afstand fra toppen
          </label>
          <Slider
            id="yPos"
            type="number"
            style={{
              marginTop: -10,
              height: 10,
              marginBottom: 10
            }}
            max={100}
            min={0}
            step={1}
            value={this.get(optionPath('yPos'), 20)}
            onChange={(_, val) => this.set(optionPath('yPos'), val)}
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
            onChange={(_, val) => this.set(optionPath('maxLen'), val)}
          />
        </div>

        <div>
          <AutoComplete
            searchText={this.get(optionPath('font'))}
            onUpdateInput={val => this.set(optionPath('font'), val)}
            floatingLabelText="Font"
            filter={AutoComplete.fuzzyFilter}
            dataSource={fonts}
            maxSearchResults={20}
          />
        </div>
      </div>
    );
  }
}
