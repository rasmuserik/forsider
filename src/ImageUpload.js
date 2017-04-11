import React from 'react';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
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
    return <div style={{
        display: 'inline-block',
        position: 'relative',
      width: '100%',
      height: 135,
      }}>
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        display: 'inline-block',
        height: 135,
        whiteSpace: 'nowrap',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}>
      <input 
        type="file"
        accept="image/*"
        multiple={true}
        id={this.inputId} 
        onChange={o => this.addImages(o.target.files)}
        style={{display: 'none'}} />


      {this.get('images', []).map(o => <Paper 
        key={o.id}
        onClick={() => this.set('ui.currentImage', o.id)}
        style={{
          display: 'inline-block',
          width: 70,
          height: 100,
          verticalAlign: 'middle',
          margin: 10,
          overflow: 'hidden',
          position: 'relative',
        }}>
        <FloatingActionButton
          style={{
            position: 'absolute', 
            right: 0,
            backgroundColor: '#900'
          }}
          mini={true}
          onClick={() => this.TODO()}
        >
        <ContentRemove />
      </FloatingActionButton>
        <img src={o.url} 
          alt=""
          style={{
            position: 'absolute',
            width: 70,
            height: 100,
          }}/>
        {o.name}
      </Paper>)}

      <FloatingActionButton 
        style={{
          margin: 10,
        }}
        onClick={()=>{
          let elem = document.getElementById(this.inputId);
          elem.click();
        }}
      >
        <ContentAdd />
      </FloatingActionButton>

    </div>
  </div>;
  }
}
