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

export default class Main extends ReCom {
  constructor(props, context) {
    super(props);
    set('upload.dirname', localStorage.getItem('forsider.dirname', ''));
  }

  componentDidMount() {
    super.componentDidMount();
    let elem = document.getElementById('select-directory');
    elem.setAttribute('type', 'file');
    elem.setAttribute('nwdirectory', 'true');
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
            <Paper style={{margin: 10, padding: 10}}>
              <input
                id="select-directory"
                style={{display: 'none'}}
                onChange={() => {
                  let elem = document.getElementById(
                    'select-directory'
                  );
                  if (elem.files[0]) {
                    let dirname = elem.files[0].path;
                    localStorage.setItem('forsider.dirname', dirname);
                    this.set('upload.dirname', dirname);
                  }
                  setTimeout(updateCoverStatus, 100);
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
                    onClick={generateCovers}
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
