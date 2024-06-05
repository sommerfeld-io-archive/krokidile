import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

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
    <a href={krokiUrl} className="text-white text-decoration-none">
      {krokiUrl}
    </a>
  );
}

// ReactDOM.render(<KrokiUrl />, document.getElementById('kroki-url'));
ReactDOM.createRoot(document.getElementById('kroki-url')).render(<KrokiUrl />);
