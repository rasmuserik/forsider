import React from 'react';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ReCom from './ReCom.js';
import {store} from './store';
import {randomId, file2url} from 'solsort-util';

export default class ImageUpload extends ReCom { 
  constructor(props, context) {
    super(props, store);
    this.inputId = randomId();
  }
  async addImages(imgs) {
    let result = [];
    for(var i = 0; i < imgs.length; ++i) {
      let img = imgs[i];
      let url =  await file2url(img);
      result.push({
        id: randomId(),
        name: img.name,
        url
      });
    }
    this.set('images', this.get('images', []).concat(result));
  }
  render() {
    return <div style={{display: 'inline-block'}}>
      <input 
        type="file"
        accept="image/*"
        multiple={true}
        id={this.inputId} 
        onChange={o => this.addImages(o.target.files)}
        style={{display: 'none'}} />

      <div style={{
        marginTop: 10,
        display: 'inline-block',
        float: 'right',
      width: 160}}>
      Tilføj billede.
        <FloatingActionButton 
          style={{marginLeft: 10}}
          onClick={()=>{
            let elem = document.getElementById(this.inputId);
            elem.click();
          }}
          mini={true}>
          <ContentAdd />
        </FloatingActionButton>
          <br/>
          <p>
            Ratio skal være mellem 4:3 og 3:2. Opløsningen skal være minimum ...
          </p>
      </div>

      {this.get('images', []).map(o => <Paper 
        key={o.id}
        style={{
          display: 'inline-block',
          width: 70,
          height: 100,
          verticalAlign: 'middle',
          margin: 10,
          overflow: 'hidden',
          position: 'relative',
        }}>
        <img src={o.url} 
          alt=""
          style={{
            position: 'absolute',
            maxWidth: 70,
            maxHeight: 100,
          }}/>
        {o.name}
      </Paper>)}

    </div>;
  }
}
