import React from 'react';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionNext
  from 'material-ui/svg-icons/navigation/chevron-right.js';
import ActionPrev
  from 'material-ui/svg-icons/navigation/chevron-left.js';
import CircularProgress from 'material-ui/CircularProgress';

import {ReCom, set, get} from 'recom';
import {str, sleep} from 'solsort-util';
import _ from 'lodash';

let resultsPerPage = 10;

export async function search(query, page) {
  page = Math.max(0, page | 0);
  if (get('search.page') === page && get('search.query') === query) {
    console.log('search already requested');
    return;
  }
  set('search.results', []);
  set('search.page', page);
  set('search.query', query);
  set('search.searching', true);
  set('search.error', undefined);

  let dbc = window.dbcOpenPlatform;
  try {
    if (!dbc.connected()) {
      await dbc.connect(
        // TODO: use actual client-id, and local library branch
        '25255a72-8b1d-4c6a-a7bf-c150e2de2a3c',
        '953788b65c480bf59f6eeee4257fb190b5ce1a3ee3fec1af58f8362d78770484'
        //          "@715100", "@715100"
      );
    }
    let results = await window.dbcOpenPlatform.search({
      q: query,
      limit: resultsPerPage,
      offset: page * resultsPerPage
    });
    if (Array.isArray(results)) {
      results = results.map(o =>
        Object.assign(o, {
          TITLE: o.dcTitle || o.dcTitleFull || o.title || [],
          CREATOR: o.dcCreator || o.creatorAut || o.creator || [],
          // TODO currently random status, should be loaded from pouchdb
          STATUS: {uploaded: Math.random() > 0.7}
        })
      );
    }

    let thumbs = await window.dbcOpenPlatform.search({
      q: query,
      limit: resultsPerPage,
      offset: page * resultsPerPage,
      fields: ['pid', 'coverUrlThumbnail']
    });
    for (let i = 0; i < thumbs.length; ++i) {
      results[i].coverUrlThumbnail = thumbs[i].coverUrlThumbnail;
    }
    set(['search', 'results'], results);

    // wait until results has been set
    await sleep();
    for (let i = 0; !_.isEqual(results, get('search.results')); ++i) {
      await sleep(10);
      if (i >= 100) {
        throw new Error('changes to results did not get through');
      }
    }
  } catch (e) {
    console.log(e);
    set('search.error', str(e));
  }
  set('search.searching', false);
}

export class SearchCQL extends ReCom {
  constructor(props, context) {
    super(props);
  }

  async search() {
    await search(this.get('query', ''), this.get('search.page', 0));
  }

  render() {
    let setPage = async n => {
      await search(this.get('query', ''), n);
    };

    return (
      <div
        style={{
          //padding: '0px 0px 10px 30px'
        }}>

        <TextField
          onKeyDown={e => e.key === 'Enter' && this.search()}
          style={{width: '80%'}}
          value={this.get('query', '')}
          onChange={(_, val) => {
            this.set('search.results', []);
            this.set('search.error', undefined);
            this.set('query', val);
            this.set('search.page', 0);
          }}
          floatingLabelText="CQL Søgestreng"
        />

        <IconButton onClick={() => this.search()}>
          {this.get('search.searching')
            ? <CircularProgress size={32} />
            : <ActionSearch />}
        </IconButton> <br />

        Side
        {' '}
        <TextField
          type="number"
          value={this.get('search.page', 0) + 1}
          key="Side"
          style={{width: 60}}
          onChange={(_, val) => setPage(Math.max(0, (val | 0) - 1))}
        />

        <IconButton
          onClick={() =>
            setPage(Math.max(0, this.get('search.page', 0) - 1))}>
          <ActionPrev />
        </IconButton>
        <IconButton
          onClick={() => setPage(this.get('search.page', 0) + 1)}>
          <ActionNext />
        </IconButton>

      </div>
    );
  }
}
