export function str(o) { 
  try {
    return JSON.stringify(o, null, 2);
  } catch(e) {
    return String(o);
  }
}

export function randomId() {
  return Math.random().toString(36).slice(2,12);
}

export let file2url = (f) => new Promise((resolve) => {
  let reader = new FileReader();
  reader.addEventListener('load', () => resolve(reader.result));
  reader.readAsDataURL(f);
});

export let loadImage = (src) => new Promise((resolve, reject) => {
  let img = new Image();
  img.src = src;
  img.onload = () => resolve(img);
  img.onerror = reject;
});

export let escapeXml = str =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;');


  /*
function nosymb(str) {
  return str.replace(/[^a-zA-Z_0-9]/g, '').toLowerCase();
}

export function loadGoogleFont(font) {
  let id = 'GOOGLEFONT' + nosymb(font);
  if(document.getElementById(id)) {
    return;
  }
  let elem = document.createElement('link');
  Object.assign(elem, {
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://fonts.googleapis.com/css?family=' + font,
  });
  document.head.appendChild(elem);
}
*/
