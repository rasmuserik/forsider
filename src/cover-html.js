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

function sectionHtml(img, id, text, cfg) {
  img = img || {url: ''};

  let bg = cfg.background || {r: 50, g: 50, b: 100, a: 0.2};
  let fg = cfg.textColor || {r: 0, g: 0, b: 0, a: 1};
  let maxLength = cfg.maxLen || 30;
  let fontScale = cfg.fontScale || 50;
  let yPos = cfg.yPos || 20;

  if (text.length > maxLength) {
    text = truncateWords(text, maxLength) + '...';
  }

  let length = Math.max(text.length);

  let html = `
    <style>
      #${id} {
        position: absolute;
        font-weight: bold;
        font-size: ${Math.min(50, 8 * fontScale / length)}px;
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
    </style>
    <div id="${id}">
      <div class="inner">
        ${escapeXml(text)}
      </div>
    </div>`;
  return html;
}

export default function coverHtml(img, meta, cfg) {
  let maxAuthors = 2;

  let creator = meta.CREATOR || [];
  if (creator.length > maxAuthors) {
    creator = '';
  } else {
    creator = creator.join(' & ');
  }
  creator = creator.replace(/\s+[(][^)]*[)]/g, '');

  let html = `
    <style>
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .main { 
        width: 100%;
        height: 100%;
      }
      .inner {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
    </style>
    <div id="main"> 
      <img src="${img.url}" />
      ${sectionHtml(img, 'title', (meta.TITLE || [])[0], cfg.title || {})}
      ${sectionHtml(img, 'creator', creator, cfg.creator || {})}
    </div>`;
  return html;
}
