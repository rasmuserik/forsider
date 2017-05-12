import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {sleep} from 'solsort-util';
import {html2png, html2jpg} from 'html-to-canvas';
import ReCom from './ReCom.js';
import {store} from './store.js';
import coverHtml from './cover-html';

import {SearchCQL} from './SearchCQL.js';
import Results from './Results.js';
import CoverOptions from './CoverOptions';
import Immutable from 'immutable';
import EditIcon from 'material-ui/svg-icons/image/edit';

let uploadWidth = 1000;
let uploadHeight = 1620;

/* NB: <input type="file" nwdirectory /> */

export default class Main extends ReCom {
  constructor(props, context) {
    super(props, store);
  }

  async generateCovers() {
    let writeFile, pathSep;
    if (window.require) {
      writeFile = window.require('fs').writeFile;
      pathSep = window.require('path').sep;
    } else {
      writeFile = () => {};
      pathSep = '/';
    }
    let upload = this.get('upload', {});
    console.log('generateCovers', upload);
    this.set('upload.uploading', true);

    let state = store.getState();
    let images = this.get('images', []);
    let results = this.get('search.results', []);
    if (images.length > 0 && results.length > 0) {
      let searchPage = this.get('search.page', 0);
      for (let i = 0; i < results.length; ++i) {
        let meta = results[i];
        let pid = meta.pid[0].replace(/[^a-zA-Z0-9]/g, '_');
        let filename =
          (upload.dirname ? upload.dirname + pathSep : '') +
          pid +
          '.jpg';

        if (
          (meta.coverUrlThumbnail && upload.overwrite) ||
          /*TODO has own cover*/ (false && upload.overwriteOwn)
        ) {
          continue;
        }

        if (!this.get('upload.uploading')) {
          return;
        }

        let image = images[(i + searchPage * 10) % images.length];
        let currentImage = image.id;
        let cfg = this.get(['options', currentImage], {});
        let html = coverHtml(image, meta, cfg);
        let dataUrl = await html2jpg(html, {
          deviceWidth: 334,
          width: uploadWidth,
          height: uploadHeight
        });

        if (!dataUrl.startsWith('data:image/jpeg;base64,')) {
          alert('error');
          throw new Error('encoding error');
        }

        let imageData = atob(dataUrl.slice(23));
        writeFile(filename, imageData, 'binary');
      }
      if (!upload.singlePage) {
        // Handle next-page
      }
    }
    this.set('upload.uploading', false);
  }

  async renderPreviews() {
    if (this.previewRunning) {
      this.previewRerun = true;
      return;
    }
    this.previewRerun = false;
    this.previewRunning = true;

    let state = store.getState();
    let images = this.get('images', []);
    let results = this.get('search.results', []);
    let previews;
    if (images.length > 0 && results.length > 0) {
      previews = this.get('previews', []);
      let searchPage = this.get('search.page', 0);
      for (let i = 0; i < results.length; ++i) {
        let image = images[(i + searchPage * 10) % images.length];
        let currentImage = image.id;
        let cfg = this.get(['options', currentImage], {});
        let meta = results[i];
        let html = coverHtml(image, meta, cfg);
        previews[i] = previews[i] || {};
        previews[i].dataUrl = await html2png(html, {
          width: 334,
          height: 540
        });
      }
    } else {
      previews = [];
    }

    await sleep();
    this.set('previews', previews);

    this.previewRunning = false;
    if (this.previewRerun) {
      setTimeout(() => this.renderPreviews(), 0);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    let elem = document.getElementById('select-directory');
    elem.setAttribute('type', 'file');
    elem.setAttribute('nwdirectory', 'true');
  }
  render() {
    this.renderPreviews();
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
            <Paper style={{margin: 10, padding: 10}}>
              <input
                id="select-directory"
                style={{display: 'none'}}
                onChange={() => {
                  let elem = document.getElementById(
                    'select-directory'
                  );
                  this.set(
                    'upload.dirname',
                    elem.files[0] && elem.files[0].path
                  );
                }}
              />
              <div
                style={{
                  display: 'inline-block',
                  width: '314',
                  overflowX: 'auto'
                }}
                onClick={() =>
                  document.getElementById('select-directory').click()}>
                <EditIcon />
                {this.get('upload.dirname') ||
                  'Sti til genererede forsider'}
              </div>

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
                  if (val) {
                    this.set('upload.overwriteOwn', true);
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
                    onClick={() => this.generateCovers()}
                  />}
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
      </div>
    );
  }
}
