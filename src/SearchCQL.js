import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import CircularProgress from 'material-ui/CircularProgress';
import {store} from './store.js';
import ReCom from './ReCom.js';

function str(o) { 
  try {
    return JSON.stringify(o, null, 2);
  } catch(e) {
    return String(o);
  }
}

export default class SearchCQL extends ReCom {

  constructor(props, context) {
    super(props, store);
    this.onSelect = props.onSelect || (()=>{});
  }

  async search() {
    let dbc = window.dbcOpenPlatform;
    this.set('search.searching', true);
    this.set('search.error', undefined);
    try {
      if(!dbc.connected()) {
        await dbc.connect(
          // TODO: use actual client-id, and local library branch
          "a36227da-e477-491e-b4a2-ccd9df365cf9", 
          "YfO7hc8OJ+vUGh9GhMZhJw06cyHxNi48fwWnVLJGPrPHvkZaYYj0cboM");
      }
      this.set('search.results',
        await window.dbcOpenPlatform.search({
          q: this.get('search.query', ''), limit: 20,
          fields: ['pid', 'title', 'creator', 'coverUrlThumbnail']}));
    } catch(e) { this.set('search.error', str(e)) }
    this.set('search.searching', false);
  }

  render() {
    return <div style={{
      //padding: '0px 0px 10px 30px'
    }}>
    <TextField 
      onKeyDown={e => e.key === 'Enter' && this.search()}
      style={{width: '80%'}}
      value={this.get('search.query', '')}
      onChange={(_, val)=>{
        this.set('search.results', []);
        this.set('search.error', undefined);
        this.set('search.query', val);
      }}
      floatingLabelText="CQL Søgestreng"/>

    <IconButton onClick={() => this.search()}>
    {this.get('search.searching')
      ? <CircularProgress size={32} />
      : <ActionSearch/> }
    </IconButton>

    {this.get('search.error') && 
        <div style={{
          display: 'inline-block',
          textAlign: 'left'
        }}>
        <h3>Error</h3>
        <pre>{this.get('search.error')}</pre>
      </div>
    }

    <div>
      {this.get('search.results', []).map(o => 
        <div 
          onClick={()=>this.onSelect(o)}
          key={o.pid}
          style={{
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
            alt=""
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
  </div>
  }
}

