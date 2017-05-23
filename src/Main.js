import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {sleep} from 'solsort-util';
import {html2png, html2jpg} from 'html-to-canvas';
//import {ReCom, store, set, get} from 'recom';
import {ReCom, store, set, get} from 'recom';
import coverHtml from './cover-html';

import {SearchCQL, updateCoverStatus} from './SearchCQL.js';
import Results from './Results.js';
import CoverOptions from './CoverOptions';
import Immutable from 'immutable';
import EditIcon from 'material-ui/svg-icons/image/edit';
import {generateCovers, renderPreviews} from './render';
import DownloadSettings from './DownloadSettings';

export default class Main extends ReCom {
  constructor(props, context) {
    super(props);
  }

  render() {
    renderPreviews();
    console.log('Store:', store.getState().toJS());

    let currentResult = this.get('ui.currentResult', 0);
    let currentPage = this.get('search.page', 0);
    let images = this.get('images', []);
    let currentImage = '';
    if (images.length > 0) {
      currentImage =
        images[(currentResult + 10 * currentPage) % images.length].id;
    }
    this.get(['options', currentImage]);

    return (
      <div>
        <Paper style={{margin: 10, padding: '0 10px 0 10px'}}>
          <SearchCQL />
          <Results />
        </Paper>

        <div style={{display: 'flex'}}>
          <div style={{flex: '0 0 334px'}}>
            <Paper
              style={{
                display: 'inline-block',
                margin: 10,
                width: 334
              }}>
              <img
                src={this.get(['previews', currentResult, 'dataUrl'])}
              />
            </Paper>
            <DownloadSettings />
          </div>

          <Paper
            style={{
              flex: '1 1 auto',
              margin: 10,
              padding: 10
            }}>
            <CoverOptions currentImage={currentImage} />
          </Paper>
        </div>
      </div>
    );
  }
}
