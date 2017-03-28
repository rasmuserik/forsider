import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Slider from 'material-ui/Slider';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';

import SearchCQL from './SearchCQL.js';
import ImageUpload from './ImageUpload.js';

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
      <SearchCQL onSelect={o=>console.log(o)} />
      <ImageUpload />

      <Paper style={{padding:10}}>
        Billeder skal mindst være 500px på den smalleste led, og have et aspect-ratio mellem 5:4 og 2:1. <br/><br/>
        {/*<Slider 
          value={this.get('ypos')}
          onChange={(_,val) => this.set('ypos', val)}
          style={{display: 'inline-block', height:200}} 
          axis="y" />*/}
        <Paper
          style={{
            height: 200, 
            width: 140, 
            display: 'inline-block', 
            verticalAlign: 'bottom'
          }}>
        </Paper>
        <br/>
        <TextField 
          floatingLabelText="Y-position"
          type="number" 
          max={1}
          min={0}
          step={0.01}
          value={this.get('ypos', 0)}
          onChange={(_,val) => this.set('ypos', val)}
          style={Object.assign({width: 100}, space)}/>
        <span style={space}>Farve</span>
        <span style={space}>Gennemsigtighed</span>
        <AutoComplete
          floatingLabelText="Font"
          filter={AutoComplete.fuzzyFilter}
          dataSource={fonts}
          maxSearchResults={20}
        />
      </Paper>
      <Paper style={{margin:10}}>
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
