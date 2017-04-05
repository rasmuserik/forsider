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
import Preview from './Preview.js';
import Color from './Color.js';
import Wireframe from './Wireframe';

import {store} from './store.js';
import ReCom from './ReCom.js';
import {escapeXml} from 'solsort-util'

let space = {margin: 10};

let fonts = ['Sans-Serif', 'Serif', 'Roboto', 'Times New Roman', 'Helvetica', 'Ubuntu', 'Cursive', 'Monospace'];

export default class Main extends ReCom {
  constructor(props, context) {
    super(props, store);
  }

  render() {
    let bg = this.get('background', {r:50,g:50,b:100,a:0.2});
    let maxLength = this.get('settings.maxLen', 30);
    let currentResult = this.get('ui.currentResult', 0);
    let result = this.get(['results', currentResult / 10 |0,  currentResult % 10], {});
    let defaultTitle = this.get('settings.defaultTitle', '');
    let title = (result.title||[])[0] || defaultTitle;
    let fontScale= this.get('settings.fontScale', 50);
    let currentImage = this.get('ui.currentImage');
    let image = this.get('images', []).filter(o => o.id === currentImage)[0];
    image = image || this.get('images', [])[0];
    image = image || {url:''};

    console.log('currentImage', currentImage, image);
    if(title.length > maxLength) {
      title = title.slice(0, maxLength) + '...';
    }
    //let creator = (result.title||['']).join(' & ');
    let html = `<style>#title { 
          position: absolute;
          font-weight: bold;
          font-size: ${Math.min(64, 10 * fontScale / title.length)}px;
          text-align: center;
          width: 100%;
          white-space: nowrap;
          background: rgba(${bg.r},${bg.g},${bg.b},${bg.a});
          overflow: hidden;
          margin: 0;
          padding: 0;
          top: ${this.get('settings.yPos', 20)}%;
          font-family: ${this.get('font')}, sans-serif; 
          }</style><div id="title">${escapeXml(title)}</div>`
    console.log('Store:', store.getState().toJS());
    return <div>
      <Paper style={{margin: 10, padding: '0 10px 0 10px'}}>
        <SearchCQL />
        <Results />
      </Paper>

      <div style={{ display: 'flex'}}>
        <div style={{flex: '0 0 300px'}}>
          <Paper style={{ display: 'inline-block', margin: 10, width: 300, }} >
            <Preview 
              style={{width: 300}}
              background={image.url}
              html={html}/>
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
          path='background' 
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
          value={this.get('settings.fontScale', 50)}
          onChange={(_,val) => this.set('settings.fontScale', val)}
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
          value={this.get('settings.yPos', 20)}
          onChange={(_,val) => this.set('settings.yPos', val)}
        />
      </div>
      <div>
        <TextField 
          floatingLabelText="Maksimal tekstlængde"
          type="number" 
          max={300}
          min={0}
          step={1}
          value={this.get('settings.maxLen', 30)}
          onChange={(_,val) => this.set('settings.maxLen', val)}
        />
      </div>
      <div>
        <TextField 
          floatingLabelText="Default titel"
          type="text" 
          value={this.get('settings.defaultTitle', '')}
          onChange={(_,val) => this.set('settings.defaultTitle', val)}
        />
      </div>

      <div>
        <AutoComplete
          searchText={this.get('font')}
          onUpdateInput={(val) => this.set('font', val)}
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

      {true && <div style={{marginTop:300}}><Wireframe/></div>}
    </div>;
  }
}
