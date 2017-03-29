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
