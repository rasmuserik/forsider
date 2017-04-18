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
import {html2png} from './html2canvas.js';
import ReCom from './ReCom.js';
import {escapeXml} from 'solsort-util'
import util from 'solsort-util'

let space = {margin: 10};

let fonts = ['Sans-Serif', 'Serif', 'Roboto', 'Times New Roman', 'Helvetica', 'Ubuntu', 'Cursive', 'Monospace'];

function truncateWords(str, maxLen) {
  let words = str.split(/\s+/g);
  let result = words[0];
  let i = 1;
  while((result + ' ' + words[i]).length < maxLen) {
    result += ' ' + words[i];
    ++i;
  }
  return result;
}

export default class Main extends ReCom {
  constructor(props, context) {
    super(props, store);
  }

  render() {
    let optionPath = name => ['options', this.get('currentImage', ''), name];
    let bg = this.get(optionPath('background'), {r:50,g:50,b:100,a:0.2});
    let maxLength = this.get(optionPath('maxLen'), 30);
    let currentResult = this.get('ui.currentResult', 0);
    let result = this.get(['results', currentResult / 10 |0,  currentResult % 10], {});

    let title = (result.TITLE || [''])[0];
    let creator = result.CREATOR || [];
    let maxAuthors = 2;
    if(creator.length > maxAuthors) {
      creator = '';
    } else {
      creator = creator.join(' & ');
    }
    creator = creator.replace(/\s+[(][^)]*[)]/g, '');
    let fontScale= this.get(optionPath('fontScale'), 50);
    let currentImage = this.get('currentImage');
    let image = this.get('images', []).filter(o => o.id === currentImage)[0];
    image = image || this.get('images', [])[0];
    image = image || {url:''};

    if(title.length > maxLength) {
      title = truncateWords(title, maxLength) + '...';
    }
    if(creator.length > maxLength) {
      creator = truncateWords(creator, maxLength) + '...';
    }
    let length = Math.max(creator.length, title.length);

    let html = `
          <style>
            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
            #main { 
              width: 100%;
              height: 100%;
            }
            #title {
              position: absolute;
              font-weight: bold;
              font-size: ${Math.min(64, 10 * fontScale / length)}px;
              text-align: center;
              width: 100%;
              white-space: nowrap;
              background: rgba(${bg.r},${bg.g},${bg.b},${bg.a});
              overflow: hidden;
              margin: 0;
              padding: 0;
              top: ${this.get(optionPath('yPos'), 20)}%;
              font-family: ${this.get(optionPath('font'))}, sans-serif; 
            }
          </style>
          <div id="main"> 
            <img src="${image.url}" />
            <div id="title">
              ${escapeXml(title)}
              <br/>
              ${escapeXml(creator)}
            </div>
          </div>`
    console.log('Store:', store.getState().toJS());
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
