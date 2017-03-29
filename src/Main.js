import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Slider from 'material-ui/Slider';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import { ChromePicker } from 'react-color';

import SearchCQL from './SearchCQL.js';
import ImageUpload from './ImageUpload.js';
import Preview from './Preview.js';

import GoogleFonts from './google-fonts.json';

import {store} from './store.js';
import ReCom from './ReCom.js';

let space = {margin: 10};

let fonts = GoogleFonts;
fonts = ['Sans-Serif', 'Serif', 'Roboto', 'Times New Roman', 'Helvetica'];

export default class Main extends ReCom {
  constructor(props, context) {
    super(props, store);
  }

  render() {
    console.log('Store:', store.getState().toJS());
    return <div>
      <Paper style={{padding:10}}>
      <SearchCQL onSelect={o=>console.log(o)} />

      <ImageUpload /><br/>


        Farve på tekstfelt<br/>
        <input type="color" /><br/>
        <TextField 
          floatingLabelText="Afstand fra toppen"
          type="number" 
          max={100}
          min={0}
          step={1}
          value={this.get('ypos', 0)}
          onChange={(_,val) => this.set('ypos', val)}
          style={Object.assign({width: 150}, space)}/><br/>


        Opacitet på tekstfelt<br/>
        {<Slider 
          value={this.get('opacity')}
          min={0}
          max={255}
          onChange={(_,val) => this.set('opacity', val)}
          style={{display: 'inline-block', width:200, height: 20}} 
          axis="x" />}

        <br/>
        <AutoComplete
          floatingLabelText="Font"
          filter={AutoComplete.fuzzyFilter}
          dataSource={fonts}
          maxSearchResults={20}
        /><br/>

      <button>Gennemse</button>
      <button>Upload</button>
      </Paper>

      <Paper style={{margin:10}}>
        {JSON.stringify(this.get('color'))}
        <ChromePicker
          color={this.get('color', {r:50,b:100,g:50,a:0.6})}
          onChangeComplete={(c) => this.set('color', c.rgb)}
        />
        <Preview 
          style={{height: 200, width: 150}}
          background={this.get(['images', 0, 'url'])}
          html={`<style>h1 { 
          position: absolute;
          margin: 0;
          padding: 0;
          top: ${this.get('ypos')}%;
            font-family: Ubuntu, sans-serif; 
          }</style><h1>hello world</h1>`}/>
        <TextField 
          floatingLabelText="Download sti"
          style={space}
        />
        <FlatButton label="Gem til disk" primary={true} />
        <br/>
        <FlatButton label="Upload opdatering af forsider" primary={true} />
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
      </div>;
  }
}
