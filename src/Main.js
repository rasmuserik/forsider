import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Immutable from 'immutable'

let space = {margin: 10};

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {ypos: 50};
  }
  render() {
    return <MuiThemeProvider>
      <div>
        <Slider 
          max={100}
          step={1}
          value={this.state.ypos}
          onChange={(_,val) => this.setState({ypos: val})}
          style={{display: 'inline-block', height:200}} 
          axis="y-reverse" />
        <span 
          style={{
            height: 200, 
            width: 200, 
            outline: '1px solid black', 
            display: 'inline-block', 
            verticalAlign: 'bottom'
          }}></span>
        <RaisedButton label="hello" style={space}/>
        <br/>
        <TextField 
          type="number" 
          value={this.state.ypos}
          onChange={(_,val) => this.setState({ypos: val})}
          style={Object.assign({width: 60}, space)}/>
      </div>
    </MuiThemeProvider>;
  }
}
