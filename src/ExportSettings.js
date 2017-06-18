import React from 'react';
import {ReCom, store, set, get} from 'recom';

import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import EditIcon from 'material-ui/svg-icons/image/edit';

import {updateCoverStatus} from './search';
import {generateCovers, renderPreviews} from './render';

export default class DownloadSettings extends ReCom {
  constructor(props, context) {
    super(props);
    set('export.dirname', localStorage.getItem('forsider.dirname', ''));
  }

  componentDidMount() {
    super.componentDidMount();
    let elem = document.getElementById('select-directory');
    elem.setAttribute('type', 'file');
    elem.setAttribute('nwdirectory', 'true');
  }

  render() {
    return (
      <Paper style={{margin: 10, padding: 10}}>
        <input
          id="select-directory"
          style={{display: 'none'}}
          onChange={() => {
            let elem = document.getElementById('select-directory');
            if (elem.files[0]) {
              let dirname = elem.files[0].path;
              localStorage.setItem('forsider.dirname', dirname);
              this.set('export.dirname', dirname);
            }
            elem.value = '';
            setTimeout(() => {generateCovers(); updateCoverStatus(); }, 100);
          }}
        />
        {/*
        <div
          style={{
            display: 'inline-block',
            width: '314',
            overflowX: 'auto'
          }}
          onClick={() =>
            document.getElementById('select-directory').click()}>
          <EditIcon />
          {this.get('export.dirname') || 'Sti til genererede forsider'}
        </div>
          */}

        <Toggle
          style={Object.assign(
            {
              display: 'inline-block',
              width: 200
            },
            {margin: 10}
          )}
          labelPosition="right"
          toggled={this.get('export.singlePage', true)}
          onToggle={(_, val) => {
            this.set('export.singlePage', val);
            this.set('export.exporting', false);
          }}
          label="Gem kun for én side søgeresultater"
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
          toggled={this.get('export.overwriteOwn', false)}
          onToggle={(_, val) => {
            this.set('export.overwriteOwn', val);
            this.set('export.exporting', false);
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
          toggled={this.get('export.overwrite', false)}
          onToggle={(_, val) => {
            this.set('export.overwrite', val);
            this.set('export.exporting', false);
            if (val) {
              this.set('export.overwriteOwn', true);
            }
          }}
          labelPosition="right"
          label="Overskriv forsider"
          thumbSwitchedStyle={{backgroundColor: '#f00'}}
          trackSwitchedStyle={{backgroundColor: '#faa'}}
          labelStyle={{color: '#000'}}
        />
        {this.get('export.exporting', false)
          ? <RaisedButton
              label="Stop forsidegenerering"
              fullWidth={true}
              secondary={true}
              onClick={() => this.set('export.exporting', false)}
            />
          : <RaisedButton
              label="Gem generiske forsider"
              fullWidth={true}
              primary={true}
          onClick={() =>
            document.getElementById('select-directory').click()}
            /> }
      </Paper>
    );
  }
}
