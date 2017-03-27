let scripts = {};

module.exports = (url) => {
  let script = scripts[url];
  if(!script) {
    script = new Promise((resolve, reject) => {
      let elem = document.createElement('script');
      elem.async = true;
      elem.onload = resolve;
      elem.onerror = reject;
      elem.src = url;
      document.head.appendChild(elem);
    });
    scripts[url] = script;
  }
  return script;
}
