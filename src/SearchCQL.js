import React from 'react';
import {ReCom, set, get} from 'recom';
import {search} from './search';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionNext from 'material-ui/svg-icons/navigation/chevron-right.js';
import ActionPrev from 'material-ui/svg-icons/navigation/chevron-left.js';
import CircularProgress from 'material-ui/CircularProgress';

export default class SearchCQL extends ReCom {
  constructor(props, context) {
    super(props);
  }

  async search() {
    this.set('images', []);
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
          {this.get('search.searching') ? (
            <CircularProgress size={32} />
          ) : (
            <ActionSearch />
          )}
        </IconButton>{' '}
        <br />
        Side{' '}
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
