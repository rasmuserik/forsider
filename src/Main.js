import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';

import SearchCQL from './SearchCQL.js';
import Results from './Results.js';
import ImageUpload from './ImageUpload.js';
import Color from './Color.js';

import {store} from './store.js';
import {html2png} from 'html-to-canvas';
import ReCom from './ReCom.js';
import {installedFonts} from 'installed-fonts';
import coverHtml from './cover-html';

let space = {margin: 10};

let fonts = [];
installedFonts()
  .then(o => fonts = o);

export default class Main extends ReCom {
  constructor(props, context) {
    super(props, store);
  }

  render() {
    console.log('Store:', store.getState().toJS());

    let currentImage = this.get('currentImage', this.get(['images', 0, 'id']));
    let image = this.get('images', []).filter(o => o.id === currentImage)[0];
    let cfg = this.get(['options', currentImage], {});
    let currentResult = this.get('ui.currentResult', 0);
    let meta = this.get(['results', currentResult / 10 |0,  currentResult % 10], {});

    let optionPath = name => ['options', currentImage, name];
    let bg = this.get(optionPath('background'), {r:50,g:50,b:100,a:0.2});

    let html = coverHtml(image, meta, cfg);
    html2png(html, {width: 334, height: 540})
      .then(s =>  {
        if(html !== this.get('ui.previewHtml')) {
          this.set('ui.previewUrl', s);
          this.set('ui.previewHtml', html);
        }
      });

    return <div>
      <Paper style={{margin: 10, padding: '0 10px 0 10px'}}>
        <SearchCQL />
        <Results />
      </Paper>

      <div style={{ display: 'flex'}}>
        <div style={{flex: '0 0 334px'}}>
          <Paper style={{ display: 'inline-block', margin: 10, width: 334}} >

            <img src={this.get('ui.previewUrl')} />
          </Paper>
        </div>

        <Paper style={{
          flex: '1 1 auto',
          margin: 10, 
          padding:10}}>
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
      </Paper>
    </div>
    <Paper style={{margin: 10, padding:10}}>

      <TextField floatingLabelText="Download sti" />
      <FlatButton label="Gem til disk" primary={true} />
      <br/>
      <RaisedButton label="Upload opdatering af forsider" primary={true} />
      <Toggle
        style={Object.assign({
          display: 'inline-block',
          width: 200}, space)}
          labelPosition="right"
          label="Overskriv"
          thumbSwitchedStyle={{backgroundColor: '#f00'}}
          trackSwitchedStyle={{backgroundColor: '#faa'}}
          labelStyle={{color: '#000'}}
        />
        <br/>
      </Paper>
      <h1 style={{background:'#f00'}}>Denne app er under udvikling, virker ikke.</h1>
    </div>;
  }
}
