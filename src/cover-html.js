import {escapeXml} from 'solsort-util';

function truncateWords(str, maxLen) {
  let words = str.split(/\s+/g);
  let result = words[0];
  let i = 1;
  while ((result + ' ' + words[i]).length < maxLen) {
    result += ' ' + words[i];
    ++i;
  }
  return result;
}

export default function coverHtml(img, meta, cfg) {
  img = img || {url: ''};

  let maxAuthors = 2;

  let bg = cfg.background || {r: 50, g: 50, b: 100, a: 0.2};
  let fg = cfg.textColor || {r: 0, g: 0, b: 0, a: 1};
  let maxLength = cfg.maxLen || 30;
  let fontScale = cfg.fontScale || 50;
  let yPos = cfg.yPos || 20;

  let creator = meta.CREATOR || [];
  if (creator.length > maxAuthors) {
    creator = '';
  } else {
    creator = creator.join(' & ');
  }
  creator = creator.replace(/\s+[(][^)]*[)]/g, '');
  if (creator.length > maxLength) {
    creator = truncateWords(creator, maxLength) + '...';
  }

  let title = (meta.TITLE || [''])[0];
  if (title.length > maxLength) {
    title = truncateWords(title, maxLength) + '...';
  }

  let length = Math.max(creator.length, title.length);

  let html = `
    <style>
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      #main { 
        width: 100%;
        height: 100%;
      }
      #title {
        position: absolute;
        font-weight: bold;
        font-size: ${Math.min(64, 10 * fontScale / length)}px;
        color: rgba(${fg.r},${fg.g},${fg.b},${fg.a});
        text-align: center;
        width: 100%;
        height: ${cfg.boxHeight || 20}%;
        white-space: nowrap;
        background: rgba(${bg.r},${bg.g},${bg.b},${bg.a});
        overflow: hidden;
        margin: 0;
        padding: 0;
        top: ${cfg.yPos || 20}%;
        font-family: ${cfg.font}, sans-serif; 
      }
      .inner {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
    </style>
    <div id="main"> 
      <img src="${img.url}" />
      <div id="title">
        <div class="inner">
        ${escapeXml(title)}
        <br/>
        ${escapeXml(creator)}
        </div>
      </div>
    </div>`;
  return html;
}
