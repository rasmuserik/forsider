import React from 'react';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionNext from 'material-ui/svg-icons/navigation/chevron-right.js';
import ActionPrev from 'material-ui/svg-icons/navigation/chevron-left.js';
import CircularProgress from 'material-ui/CircularProgress';

import {store} from './store.js';
import ReCom from './ReCom.js';
import {str} from 'solsort-util';

let resultsPerPage = 10;

async function search(query, page) { // ###
  
  if(store.getState().getIn(['search', page], undefined) === page) {
    console.log('search already requested');
    return;
  }

  function set(path, value) {
    store.dispatch({type: 'SET_IN', path, value});
  }

  let dbc = window.dbcOpenPlatform;
  try {
    if(!dbc.connected()) {
      await dbc.connect(
        // TODO: use actual client-id, and local library branch
        "a36227da-e477-491e-b4a2-ccd9df365cf9", 
        "YfO7hc8OJ+vUGh9GhMZhJw06cyHxNi48fwWnVLJGPrPHvkZaYYj0cboM",
        //          "@715100", "@715100"
      );
    }
    let results = 
      await window.dbcOpenPlatform.search({
        q: query, limit: resultsPerPage, offset: page * resultsPerPage,
      });
    if(Array.isArray(results)) {
      results = results.map(o => Object.assign(o, {
        TITLE: o.dcTitle || o.dcTitleFull || o.title || [],
        CREATOR: o.dcCreator || o.creatorAut || o.creator || [],
      }));
    }
    set(['search', 'results'], results);
    let thumbs = 
      await window.dbcOpenPlatform.search({
        q: query, limit: resultsPerPage, offset: page * resultsPerPage,
        fields: ['pid', 'coverUrlThumbnail']
      });
    for(let i = 0; i < thumbs.length; ++i) {
      results[i].coverUrlThumbnail = thumbs[i].coverUrlThumbnail;
    }
    set(['search', 'results'], results);
  } catch(e) { 
    console.log(e);
    set('ui.searchError', str(e)) 
  }
}

export default class SearchCQL extends ReCom { // ##
  constructor(props, context) { // ###
    super(props, store);
  }

  async search() { // ###
    this.set('ui.searching', true);
    this.set('ui.searchError', undefined);
    await search(this.get('query', ''), this.get('ui.resultPage', 0));
    this.set('ui.searching', false);
  }

  render() { // ###
    let setPage  = async (n) => {
      n = Math.max(0, n | 0);
      this.set('search.results', []);
      this.set('ui.resultPage', n);
      this.set('ui.searching', true);
      this.set('ui.searchError', undefined);
      await search(this.get('query', ''), n);
      this.set('ui.searching', false);
    }


    return <div style={{
      //padding: '0px 0px 10px 30px'
    }}>

    <TextField 
      onKeyDown={e => e.key === 'Enter' && this.search()}
      style={{width: '80%'}}
      value={this.get('query', '')}
      onChange={(_, val)=>{
        this.set('search.results', []);
        this.set('ui.searchError', undefined);
        this.set('query', val);
        this.set('ui.resultPage', 0);
      }}
      floatingLabelText="CQL Søgestreng"/>

    <IconButton onClick={() => this.search()}>
      {this.get('ui.searching')
        ? <CircularProgress size={32} />
        : <ActionSearch/> }
      </IconButton> <br/>

      Side <TextField
        type="number"
        value={this.get('ui.resultPage', 0) + 1}
        style={{width:60}}
        onChange={(_, val) => setPage(Math.max(0,(val|0) - 1)) }
      />

    <IconButton
      onClick={() => setPage(Math.max(0,
          this.get('ui.resultPage', 0) - 1))}
        >
          <ActionPrev/>
        </IconButton>
        <IconButton
          onClick={() => setPage(this.get('ui.resultPage', 0) + 1)} 
          >
            <ActionNext />
          </IconButton>

        </div>
  }
}
