import React from 'react';
import {store} from './store.js';
import ReCom from './ReCom.js';
import {randomId, loadImage} from 'solsort-util';

export default class Preview extends ReCom {

  constructor(props, context) {
    super(props, store);
    this.id = randomId();
  }

  render() {
    this.get('ypos');
    return <canvas id={this.id} style={this.props.style}/> 
  }

  async renderToCanvas() {
    let imgSrc = this.props.background || `data:image/svg+xml;utf8,
       <svg xmlns="http://www.w3.org/2000/svg" 
       width="334" height="480"></svg>`;

    let html = this.props.html || '';

    let img = await loadImage(imgSrc);
    let canvas = document.getElementById(this.id);
    let context = canvas.getContext('2d');
    let [w, h] = [img.width, img.height];
    [canvas.width, canvas.height] = [w, h];

    let svgImg = await loadImage(`data:image/svg+xml;utf8,` +
      `<svg xmlns="http://www.w3.org/2000/svg"
            width="${w}"
            height="${h}" transform="scale(${w/320})">
         <foreignObject width="320" height="${320*h/w}">
            <div id="thumbnail-html" xmlns="http://www.w3.org/1999/xhtml">
            ${html}
            </div>
         </foreignObject>
       </svg>`);

    context.drawImage(img, 0,0);
    context.drawImage(svgImg, 0, 0);
  }

  componentDidMount() {
    super.componentDidMount();
    this.renderToCanvas();
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    this.renderToCanvas();
  }
}

