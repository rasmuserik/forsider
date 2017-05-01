import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {html2png} from 'html-to-canvas';
import ReCom from './ReCom.js';
import {store} from './store.js';
import coverHtml from './cover-html';

import {SearchCQL} from './SearchCQL.js';
import Results from './Results.js';
import CoverOptions from './CoverOptions';
import Immutable from 'immutable';

export default class Main extends ReCom {
  constructor(props, context) {
    super(props, store);
  }

  async renderPreviews() {
    if(this.renderRunning) {
      this.renderRerun = true;
      return;
    }
    this.renderRerun = false;
    this.renderRunning = true;

    let state = store.getState();
    let images = this.get('images', []);
    let results = this.get('search.results', []);
    let previews;
    if(images.length > 0 
      && results.length > 0) {
      previews = this.get('previews', []);
      let searchPage = this.get('search.page', 0);
      for(let i = 0; i < results.length; ++i) {
        let image = images[(i + searchPage * 10) % images.length];
        let currentImage = image.id;
        let cfg = this.get(['options', currentImage], {});
        let meta = results[i];
        let html = coverHtml(image, meta, cfg);
        previews[i] = previews[i] || {};
        previews[i].dataUrl = await html2png(html, {width: 334, height: 540});
      }
    } else {
      previews = [];
    }
    this.set('previews', previews);

    this.renderRunning = false;
    if(this.renderRerun) {
      setTimeout(() => this.renderPreviews(), 0);
    }
  }

  render() {
    this.renderPreviews();
    console.log('Store:', store.getState().toJS());

    let currentResult = this.get('ui.currentResult', 0);
    let currentPage = this.get('search.page', 0);
    let images = this.get('images');
    let currentImage = '';
    if(images.length > 0) {
      currentImage = images[(currentResult + 10 * currentPage) % images.length].id;
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
            <Paper style={{margin: 10, padding: 10}}>
              <Toggle
                style={Object.assign(
                  {
                    display: 'inline-block',
                    width: 200
                  },
                  {margin: 10}
                )}
                labelPosition="right"
                toggled={this.get('upload.singlePage', true)}
                onToggle={(_, val) => {
                  this.set('upload.singlePage', val);
                  this.set('upload.uploading', false);
                }}
                label="Upload kun for én side søgeresultater"
                labelStyle={{color: '#000'}}
              />
              <Toggle
                style={Object.assign(
                  {
                    display: 'inline-block',
                    width: 200
                  },
                  {margin: 10}
                )}
                toggled={this.get('upload.overwriteOwn', false)}
                onToggle={(_, val) => {
                  this.set('upload.overwriteOwn', val);
                  this.set('upload.uploading', false);
                }}
                labelPosition="right"
                label="Overskriv egne forsider"
                labelStyle={{color: '#000'}}
              />
              <Toggle
                style={Object.assign(
                  {
                    display: 'inline-block',
                    width: 200
                  },
                  {margin: 10}
                )}
                toggled={this.get('upload.overwrite', false)}
                onToggle={(_, val) => {
                  this.set('upload.overwrite', val);
                  this.set('upload.uploading', false);
                  if(val) {
                    this.set('upload.overwriteOwn', true)
                  }
                }}
                labelPosition="right"
                label="Overskriv forsider"
                thumbSwitchedStyle={{backgroundColor: '#f00'}}
                trackSwitchedStyle={{backgroundColor: '#faa'}}
                labelStyle={{color: '#000'}}
              />
              {this.get('upload.uploading', false)
                  ? <RaisedButton
                    label="Stop upload"
                    fullWidth={true}
                    secondary={true}
                    onClick={() => this.set('upload.uploading', false)}
                  />
                  : <RaisedButton
                    label="Upload opdatering af forsider"
                    fullWidth={true}
                    primary={true}
                    onClick={() => this.set('upload.uploading', true)}
                  />}
                </Paper>
                <Paper
                  style={{
                    display: 'inline-block',
                    margin: 10,
                    width: 334
                  }}>
                  <img src={this.get(['previews', currentResult , 'dataUrl'])} />
                </Paper>
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
            <h1 style={{background: '#f00'}}>
              Denne app er under udvikling, virker ikke.
            </h1>
          </div>
    );
  }
}
