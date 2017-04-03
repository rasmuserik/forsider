import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import AutoComplete from 'material-ui/AutoComplete';

import SearchCQL from './SearchCQL.js';
import ImageUploadOld from './ImageUploadOld.js';

import {store} from './store.js';
import ReCom from './ReCom.js';


let fonts = ['Sans-Serif', 'Serif', 'Roboto', 'Times New Roman', 'Helvetica', 'Ubuntu', 'Cursive', 'Monospace'];


export default class Main extends ReCom {
  constructor(props, context) {
    super(props, store);
  }

  render() {
    return <Paper style={{padding:10}}>
      <SearchCQL onSelect={o=>console.log(o)} />

      <ImageUploadOld /><br/>

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
        style={{width: 150, margin:10}}/><br/>

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
        searchText={this.get('font')}
        onUpdateInput={(val) => this.set('font', val)}
        floatingLabelText="Font"
        filter={AutoComplete.fuzzyFilter}
        dataSource={fonts}
        maxSearchResults={20}
      /><br/>

    <button>Gennemse</button>
    <button>Upload</button>
  </Paper>;
  }
}
