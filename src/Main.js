import React from 'react';
import {ReCom, store, set, get} from 'recom';

import Paper from 'material-ui/Paper';

import {SearchCQL, updateCoverStatus} from './SearchCQL';
import Results from './Results';
import CoverOptions from './CoverOptions';
import {generateCovers, renderPreviews} from './render';
import DownloadSettings from './DownloadSettings';


export default class Main extends ReCom {

  constructor(props, context) {
    super(props);
  }

  render() {
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
    renderPreviews();

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
