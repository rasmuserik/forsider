import React from 'react';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import Immutable from 'immutable'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';

let space = {margin: 10};

let fonts = ['Sans-Serif', 'Serif', 'Roboto', 'Times New Roman', 'Helvetica'];
let imgStyle = {
  display: 'inline-block',
  width: 70,
  height: 100,
  verticalAlign: 'middle',
  margin: 10
};

export default class Main extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {ypos:0.8};
    this.theme = context.muiTheme;
  }
  render() {
    console.log(this.theme);
    return <div>
      <Paper style={{textAlign: 'center'}}>
        <TextField style={{width: '80%'}}
          floatingLabelText="CQL Søgning"/>
        <IconButton>
          <ActionSearch/>
        </IconButton>
      </Paper>
      <FloatingActionButton mini={true}>
        <ContentAdd />
      </FloatingActionButton>
      <Paper style={imgStyle}></Paper>
      <Paper style={imgStyle}></Paper>
      <Paper style={imgStyle}></Paper>
      <Paper style={imgStyle}></Paper>

      <Paper style={{padding:10}}>
        {/*<Slider 
          value={this.state.ypos}
          onChange={(_,val) => this.setState({ypos: val})}
          style={{display: 'inline-block', height:200}} 
          axis="y" />*/}
        <Paper
          style={{
            height: 200, 
            width: 140, 
            display: 'inline-block', 
            verticalAlign: 'bottom'
          }}>
        </Paper>
      <br/>
        <TextField 
          floatingLabelText="Y-position"
          type="number" 
          max={1}
          min={0}
          step={0.01}
          value={this.state.ypos}
          onChange={(_,val) => this.setState({ypos: val})}
          style={Object.assign({width: 100}, space)}/>
        <AutoComplete
          floatingLabelText="Font"
          filter={AutoComplete.fuzzyFilter}
          dataSource={fonts}
          maxSearchResults={5}
        />
      </Paper>
    </div>;
  }
}
