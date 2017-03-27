import React from 'react';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

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
  }
  render() {
    return <div>
      <FloatingActionButton mini={true}>
        <ContentAdd />
      </FloatingActionButton>
      <Paper style={imgStyle}></Paper>
      <Paper style={imgStyle}></Paper>
      <Paper style={imgStyle}></Paper>
      <Paper style={imgStyle}></Paper>
      </div>;
  }
}
