import {sleep} from 'solsort-util';
import {html2png, html2jpg} from 'html-to-canvas';
import {ReCom, store, set, get} from 'recom';
import coverHtml from './cover-html';
import {search, updateCoverStatus} from './search';

async function renderSearchResult(i, width, height) {
  let images = get('images', []);
  let results = get('search.results', []);
  let searchPage = get('search.page', 0);
  let image = images[(i + searchPage * 10) % images.length];
  let currentImage = image.id;
  let cfg = get(['options', currentImage], {});
  let meta = results[i];
  let html = coverHtml(image, meta, cfg);
  return await html2jpg(html, {
    deviceWidth: 334,
    width: width,
    height: height
  });
}

export async function generateCovers() {
  let writeFileSync, pathSep;
  if (window.require) {
    writeFileSync = window.require('fs').writeFileSync;
    pathSep = window.require('path').sep;
  } else {
    writeFileSync = () => {};
    pathSep = '/';
  }

  set('export.exporting', true);

  do {
    let exportSettings = Object.assign(
      {singlePage: true},
      get('export', {})
    );
    let results = get('search.results', []);
    if (get('images', []).length === 0 || results.length === 0) {
      set('export.exporting', false);
      return;
    }

    for (let i = 0; i < results.length; ++i) {
      await sleep();
      let meta = results[i];
      let pid = meta.pid[0].replace(/[^a-zA-Z0-9]/g, '_');
      let filename =
        (exportSettings.dirname
          ? exportSettings.dirname + pathSep
          : '') +
        pid +
        '.jpg';

      if (
        (!meta.HAS_OWN_COVER &&
          meta.coverUrlThumbnail &&
          !exportSettings.overwrite) ||
        (meta.HAS_OWN_COVER && !exportSettings.overwriteOwn)
      ) {
        continue;
      }

      if (!get('export.exporting')) {
        return;
      }

      let dataUrl = await renderSearchResult(i, 1000, 1620);

      if (!dataUrl.startsWith('data:image/jpeg;base64,')) {
        alert('error');
        throw new Error('encoding error');
      }

      let imageData = atob(dataUrl.slice(23));
      writeFileSync(filename, imageData, 'binary');
      updateCoverStatus();
    }

    if (exportSettings.singlePage) {
      set('export.exporting', false);
      return;
    }
    await search(get('search.query'), 1 + get('search.page', 0));
  } while (get('export.exporting'));
}

let previewRerun = false, previewRunning = false;

export async function renderPreviews() {
  if (previewRunning) {
    previewRerun = true;
    return;
  }
  previewRerun = false;
  previewRunning = true;

  let results = get('search.results', []);
  let previews;
  if (get('images', []).length > 0 && results.length > 0) {
    previews = get('previews', []);
    for (let i = 0; i < results.length; ++i) {
      previews[i] = previews[i] || {};
      previews[i].dataUrl = await renderSearchResult(i, 334, 540);
      await sleep();
    }
  } else {
    previews = [];
  }
  set('previews', previews);

  previewRunning = false;
  if (previewRerun) {
    setTimeout(renderPreviews, 0);
  }
}
