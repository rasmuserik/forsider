import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import CircularProgress from 'material-ui/CircularProgress';

function str(o) { 
  try {
    return JSON.stringify(o, null, 2);
  } catch(e) {
    return String(o);
  }
}

export default class SearchCQL extends React.Component {

  constructor(props, context) {
    super(props);
    this.onSelect = props.onSelect || (()=>{});
    this.state = {
      query: '',
      searching: false,
      error: '',
      results: []
    };
  }

  set(k, v) { 
    this.setState(o => o[k] = v);
  }

  async search() {
    let dbc = window.dbcOpenPlatform;
    this.set('searching', true);
    this.set('error', '');
    try {
      if(!dbc.connected()) {
        await dbc.connect(
          // TODO: use actual client-id, and local library branch
          "a36227da-e477-491e-b4a2-ccd9df365cf9", 
          "YfO7hc8OJ+vUGh9GhMZhJw06cyHxNi48fwWnVLJGPrPHvkZaYYj0cboM");
      }
      this.set('results',
        await window.dbcOpenPlatform.search({
          q: this.state.query, limit: 20,
          fields: ["title", "creator", "coverUrlThumbnail"]}));
    } catch(e) { this.set('error', str(e)) }
    this.set('searching', false);
  }

  render() {
    return <Paper style={{
      padding: '0px 0px 10px 30px'
    }}>
    <TextField 
      onKeyDown={e => e.key === 'Enter' && this.search()}
      style={{width: '80%'}}
      value={this.state.query}
      onSubmit={()=>console.log('ok')}
      onChange={(_, val)=>{
        this.set('results', []);
        this.set('error', '');
        this.set('query', val);
      }}
      floatingLabelText="CQL Søgning"/>

    <IconButton onClick={() => this.search()}>
    {this.state.searching 
      ? <CircularProgress size={32} />
      : <ActionSearch/> }
    </IconButton>

    {this.state.error && 
        <div style={{
          display: 'inline-block',
          textAlign: 'left'
        }}>
        <h3>Error</h3>
        <pre>{this.state.error}</pre>
      </div>
    }

    <div>
      {this.state.results.map(o => 
        <div 
          onClick={()=>this.onSelect(o)}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            textAlign: 'left',
            height: 42,
            margin: 1,
            width: 240,
            overflow: 'hidden'
          }}>
          <img 
            src={o.coverUrlThumbnail}
            style={{ 
              height: 40,
              width: 30,
              border: '1px solid black',
              float: 'left',
              marginRight: 4
            }}/>
          <div>{o.title}</div>
          <div style={{fontStyle: 'italic'}}>{o.creator}</div>
        </div>
      )}
    </div>
  </Paper>
  }
}

