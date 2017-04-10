import {loadImage} from 'solsort-util';

export async function html2canvas(html, opt) {
  opt = opt || {};
  let w = opt.width || 320;
  let h = opt.height || 480;
  let dw = opt.deviceWidth || w;

  let svgImg = await loadImage(`data:image/svg+xml;utf8,` +
      `<svg xmlns="http://www.w3.org/2000/svg"
            width="${w}"
            height="${h}" transform="scale(${w/320})">
         <foreignObject width="${dw}" height="${h*dw/w}">
            <div id="thumbnail-html" xmlns="http://www.w3.org/1999/xhtml">
            ${html}
            </div>
         </foreignObject>
       </svg>`);

  let canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(svgImg, 0, 0);
  return canvas;
}

export async function html2png(html, opt) {
  let canvas = await html2canvas(html, opt);
  return canvas.toDataURL("image/png");
}
