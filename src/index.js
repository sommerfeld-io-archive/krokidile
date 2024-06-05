import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// see https://docs.kroki.io/kroki/setup/encode-diagram/#nodejs
const pako = require('pako');
const Buffer = require('buffer/').Buffer; // note the trailing slash

// todo https://github.com/sommerfeld-io/krokidile/issues/41
const krokiUrl = 'https://kroki.io';
// const krokiUrl = 'http://kroki:3001';

document.getElementById('diagram-code').addEventListener('input', async function (e) {
  const diagramCode = e.target.value;

  if (!diagramCode) {
    console.log('Diagram code is empty');
    return;
  }

  // const encodedDiagramCode = btoa(encodeURIComponent(diagramCode));
  const data = Buffer.from(diagramCode, 'utf8');
  const compressed = pako.deflate(data, { level: 9 });
  const encodedDiagramCode = Buffer.from(compressed)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const response = await fetch(`${krokiUrl}/plantuml/svg/${encodedDiagramCode}`);
  const imageResult = await response.text();
  document.getElementById('preview').innerHTML = `${imageResult}`;
});

function KrokiUrl() {
  return (
    <a href={krokiUrl} class="nav-link link-body-emphasis px-2">
      {krokiUrl}
    </a>
  );
}

ReactDOM.render(<KrokiUrl />, document.getElementById('kroki-url'));
