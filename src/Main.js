import React from 'react';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import Immutable from 'immutable'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import CircularProgress from 'material-ui/CircularProgress';

import GoogleFonts from './google-fonts.json';

let space = {margin: 10};

let fonts = GoogleFonts;
fonts = ['Sans-Serif', 'Serif', 'Roboto', 'Times New Roman', 'Helvetica'];
let imgStyle = {
  display: 'inline-block',
  width: 70,
  height: 100,
  verticalAlign: 'middle',
  margin: 10
};

function str(o) {
  try {
    return JSON.stringify(o, null, 2);
  } catch(e) {
    return String(o);
  }
}

class SearchCQL extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      query: '',
      searching: false,
      error: '',
      results: []
    };
  }
  set(k, v) { 
    this.state[k] = v;
    this.setState(this.state);
  }
  render() {
    let dbc = window.dbcOpenPlatform;
    return <Paper style={{
      padding: '0px 0px 10px 30px'
    }}>
    <TextField 
      style={{width: '80%'}}
      value={this.state.query}
      onChange={(_, val)=>{
        this.set('results', []);
        this.set('error', '');
        this.set('query', val);
      }}
      floatingLabelText="CQL Søgning"/>

    <IconButton onClick={async ()=>{
      this.set('searching', true);
      this.set('error', '');
      try {
        if(!dbc.connected()) {
          await dbc.connect(
            // TODO: use actual client-id, and local library branch
            "a36227da-e477-491e-b4a2-ccd9df365cf9", 
            "YfO7hc8OJ+vUGh9GhMZhJw06cyHxNi48fwWnVLJGPrPHvkZaYYj0cboM");
        }
        this.set('results',
          await window.dbcOpenPlatform.search({
            q: this.state.query, limit: 20,
            fields: ["title", "creator", "coverUrlThumbnail"]}));
      } catch(e) { this.set('error', str(e)) }
      this.set('searching', false);
    }}>
    {this.state.searching 
      ? <CircularProgress size={32} />
      : <ActionSearch/> }
    </IconButton>

    {this.state.error && 
        <div style={{
          display: 'inline-block',
          textAlign: 'left'
        }}>
        <h3>Error</h3>
        <pre>{this.state.error}</pre>
      </div>
    }

    <div>
      {this.state.results.map(o => 
        <div style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          textAlign: 'left',
          height: 42,
          margin: 1,
          width: 240,
          overflow: 'hidden'
        }}>
        <img 
          src={o.coverUrlThumbnail}
          style={{ 
            height: 40,
            width: 30,
            border: '1px solid black',
            float: 'left',
            marginRight: 4
          }}/>
        <div>{o.title}</div>
        <div style={{fontStyle: 'italic'}}>{o.creator}</div>
      </div>
      )}
    </div>

  </Paper>
  }
}

export default class Main extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {ypos:0.8};
  }
  render() {
    return <div>
      <SearchCQL/>
      <FloatingActionButton mini={true}>
        <ContentAdd />
      </FloatingActionButton>
      <Paper style={imgStyle}></Paper>
      <Paper style={imgStyle}></Paper>
      <Paper style={imgStyle}></Paper>
      <Paper style={imgStyle}></Paper>

      <Paper style={{padding:10}}>
        Billeder skal mindst være 500px på den smalleste led, og have et aspect-ratio mellem 5:4 og 2:1. <br/><br/>
        {/*<Slider 
          value={this.state.ypos}
          onChange={(_,val) => this.setState({ypos: val})}
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
          value={this.state.ypos}
          onChange={(_,val) => this.setState({ypos: val})}
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
