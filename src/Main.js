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

export default class Main extends ReCom {
  constructor(props, context) {
    super(props, store);
  }

  render() {
    console.log('Store:', store.getState().toJS());

    let currentImage = this.get(
      'currentImage',
      this.get(['images', 0, 'id'])
    );
    let image = this.get('images', []).filter(
      o => o.id === currentImage
    )[0];
    let cfg = this.get(['options', currentImage], {});
    let currentResult = this.get('ui.currentResult', 0);
    let meta = this.get(['search', 'results', currentResult], {});

    let optionPath = name => ['options', currentImage, name];
    let bg = this.get(optionPath('background'), {
      r: 50,
      g: 50,
      b: 100,
      a: 0.2
    });

    let html = coverHtml(image, meta, cfg);
    html2png(html, {width: 334, height: 540}).then(s => {
      if (html !== this.get('ui.previewHtml')) {
        this.set('ui.previewUrl', s);
        this.set('ui.previewHtml', html);
      }
    });

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
                onToggle={(_, val) =>
                  this.set('upload.singlePage', val)}
                label="Upload kun én side"
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
                onToggle={(_, val) => this.set('upload.overwrite', val)}
                labelPosition="right"
                label="Overskriv"
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
              <img src={this.get('ui.previewUrl')} />
            </Paper>
          </div>

          <Paper
            style={{
              flex: '1 1 auto',
              margin: 10,
              padding: 10
            }}>
            <CoverOptions />
          </Paper>
        </div>
        <h1 style={{background: '#f00'}}>
          Denne app er under udvikling, virker ikke.
        </h1>
      </div>
    );
  }
}
