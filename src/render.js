import {sleep} from 'solsort-util';
import {html2png, html2jpg} from 'html-to-canvas';
import {ReCom, store, set, get} from 'recom';
import coverHtml from './cover-html';
import {search, updateCoverStatus} from './SearchCQL';

let uploadWidth = 1000;
let uploadHeight = 1620;

let previewRerun = false, previewRunning = false;

export async function generateCovers() {
  let writeFileSync, pathSep;
  if (window.require) {
    writeFileSync = window.require('fs').writeFileSync;
    pathSep = window.require('path').sep;
  } else {
    writeFileSync = () => {};
    pathSep = '/';
  }
  set('upload.uploading', true);

  do {
    let upload = Object.assign({singlePage: true}, get('upload', {}));
    let state = store.getState();
    let images = get('images', []);
    let results = get('search.results', []);
    if (images.length === 0 || results.length === 0) {
      set('upload.uploading', false);
      return;
    }

    let searchPage = get('search.page', 0);
    for (let i = 0; i < results.length; ++i) {
      await sleep();
      let meta = results[i];
      let pid = meta.pid[0].replace(/[^a-zA-Z0-9]/g, '_');
      let filename =
        (upload.dirname ? upload.dirname + pathSep : '') + pid + '.jpg';

      if (
        (!meta.HAS_OWN_COVER &&
          meta.coverUrlThumbnail &&
          !upload.overwrite) ||
        (meta.HAS_OWN_COVER && !upload.overwriteOwn)
      ) {
        continue;
      }

      if (!get('upload.uploading')) {
        return;
      }

      let image = images[(i + searchPage * 10) % images.length];
      let currentImage = image.id;
      let cfg = get(['options', currentImage], {});
      let html = coverHtml(image, meta, cfg);
      let dataUrl = await html2jpg(html, {
        deviceWidth: 334,
        width: uploadWidth,
        height: uploadHeight
      });

      if (!dataUrl.startsWith('data:image/jpeg;base64,')) {
        alert('error');
        throw new Error('encoding error');
      }

      let imageData = atob(dataUrl.slice(23));
      writeFileSync(filename, imageData, 'binary');
      updateCoverStatus();
    }

    if (upload.singlePage) {
      set('upload.uploading', false);
      return;
    }
    await search(get('search.query'), 1 + get('search.page', 0));
  } while (get('upload.uploading'));
}

export async function renderPreviews() {
  if (previewRunning) {
    previewRerun = true;
    return;
  }
  previewRerun = false;
  previewRunning = true;

  let state = store.getState();
  let images = get('images', []);
  let results = get('search.results', []);
  let previews;
  if (images.length > 0 && results.length > 0) {
    previews = get('previews', []);
    let searchPage = get('search.page', 0);
    for (let i = 0; i < results.length; ++i) {
      let image = images[(i + searchPage * 10) % images.length];
      let currentImage = image.id;
      let cfg = get(['options', currentImage], {});
      let meta = results[i];
      let html = coverHtml(image, meta, cfg);
      previews[i] = previews[i] || {};
      previews[i].dataUrl = await html2png(html, {
        width: 334,
        height: 540
      });
      await sleep();
    }
  } else {
    previews = [];
  }

  await sleep();
  set('previews', previews);

  previewRunning = false;
  if (previewRerun) {
    setTimeout(() => renderPreviews(), 0);
  }
}
