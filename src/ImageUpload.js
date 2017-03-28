import React from 'react';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ReCom from './ReCom.js';
import {store} from './store';


function randomId() {
  return Math.random().toString(36).slice(2,12);
}

let file2url = (f) => new Promise((resolve) => {
  let reader = new FileReader();
  reader.addEventListener('load', () => resolve(reader.result));
  reader.readAsDataURL(f);
});

export default class ImageUpload extends ReCom { 
  constructor(props, context) {
    super(props, store);
    this.inputId = randomId();
    this.state = {images: []}
  }
  async addImages(imgs) {
    for(var i = 0; i < imgs.length; ++i) {
      let img = imgs[i];
      let url =  await file2url(img);
      this.setState(o => o.images.push({
        id: randomId(),
        name: img.name,
        url
      }));
    }
    console.log('addImages', imgs);
  }
  render() {
    return <div>
      <input 
        type="file"
        accept="image/*"
        multiple={true}
        id={this.inputId} 
        onChange={o => this.addImages(o.target.files)}
        style={{display: 'none'}} />

      <FloatingActionButton 
        onClick={()=>{
          let elem = document.getElementById(this.inputId);
          elem.click();
        }}
        mini={true}>
        <ContentAdd />
      </FloatingActionButton>

      {this.state.images.map(o => <Paper 
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
