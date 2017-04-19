import React from 'react';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import CircularProgress from 'material-ui/CircularProgress';

import {store} from './store.js';
import ReCom from './ReCom.js';
import {str} from 'solsort-util';

export default class SearchCQL extends ReCom {
  constructor(props, context) {
    super(props, store);
  }

  async search() {
    let dbc = window.dbcOpenPlatform;
    this.set('ui.searching', true);
    this.set('ui.searchError', undefined);
    try {
      if(!dbc.connected()) {
        await dbc.connect(
          // TODO: use actual client-id, and local library branch
          "a36227da-e477-491e-b4a2-ccd9df365cf9", 
          "YfO7hc8OJ+vUGh9GhMZhJw06cyHxNi48fwWnVLJGPrPHvkZaYYj0cboM",
          //          "@715100", "@715100"
        );
      }
      this.set(['results', 0], 'loading');
      let results = 
        await window.dbcOpenPlatform.search({
          q: this.get('query', ''), limit: 10,
        });
      if(Array.isArray(results)) {
        results = results.map(o => Object.assign(o, {
          TITLE: o.dcTitle || o.dcTitleFull || o.title || [],
          CREATOR: o.dcCreator || o.creatorAut || o.creator || [],
        }));
      }
      this.set(['results', 0], results);
      let thumbs = 
        await window.dbcOpenPlatform.search({
          q: this.get('query', ''), limit: 10,
          fields: ['pid', 'coverUrlThumbnail']
        });
      for(let i = 0; i < thumbs.length; ++i) {
        results[i].coverUrlThumbnail = thumbs[i].coverUrlThumbnail;
      }
      this.set(['results', 0], results);
    } catch(e) { 
      console.log(e);
      this.set('ui.searchError', str(e)) 
    }
    this.set('ui.searching', false);
  }

  render() {
    return <div style={{
      //padding: '0px 0px 10px 30px'
    }}>
    <TextField 
      onKeyDown={e => e.key === 'Enter' && this.search()}
      style={{width: '80%'}}
      value={this.get('query', '')}
      onChange={(_, val)=>{
        this.set('results', []);
        this.set('ui.searchError', undefined);
        this.set('query', val);
      }}
      floatingLabelText="CQL Søgestreng"/>

    <IconButton onClick={() => this.search()}>
    {this.get('ui.searching')
      ? <CircularProgress size={32} />
      : <ActionSearch/> }
    </IconButton>
  </div>
  }
}
