function shouldInject() {
  const documentElement = document.documentElement.nodeName;
  const docElemCheck = documentElement
    ? documentElement.toLowerCase() === 'html'
    : true;
  const { doctype } = window.document;
  const docTypeCheck = doctype ? doctype.name === 'html' : true;
  return docElemCheck && docTypeCheck;
}

const injectScript = (file_path: string) => {
  console.log(file_path);
  const container = document.head || document.documentElement;
  const script = document.createElement('script');
  script.setAttribute('async', 'false');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  container.insertBefore(script, container.children[0]);
  // node.appendChild(script);
  // node.removeChild(script);
};


if (shouldInject()) {
  injectScript(chrome.runtime.getURL('assets/content.js'));
} else {
  console.warn('inject not allowed');
}
