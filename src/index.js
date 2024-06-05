import React from 'react';
import ReactDOM from 'react-dom/client';
import * as monaco from 'monaco-editor';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';

// see https://docs.kroki.io/kroki/setup/encode-diagram/#nodejs
const pako = require('pako');
const Buffer = require('buffer/').Buffer; // note the trailing slash

const KROKI_URL = 'https://kroki.io'; // todo https://github.com/sommerfeld-io/krokidile/issues/41

//
// Setup Monaco Editor
//
monaco.editor.create(document.getElementById('editor'), {
	value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
	language: 'javascript',
  theme: 'vs-dark'
});

//
// Get the diagram code from the input field and send it to the Kroki service.
//
// document.getElementById('diagram-code').addEventListener('input', async function (e) {
//   const diagramCode = e.target.value;

//   if (!diagramCode) {
//     console.log('Diagram code is empty');
//     return;
//   }

//   const data = Buffer.from(diagramCode, 'utf8');
//   const compressed = pako.deflate(data, { level: 9 });
//   const encodedDiagramCode = Buffer.from(compressed)
//     .toString('base64')
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_');

//   const response = await fetch(`${KROKI_URL}/plantuml/svg/${encodedDiagramCode}`);
//   const imageResult = await response.text();
//   document.getElementById('preview').innerHTML = `${imageResult}`;
// });

//
// Return the Kroki URL as html-link to display in the footer.
//
function KrokiHyperlink() {
  return (
    <a href={KROKI_URL} className="text-secondary  text-decoration-none">
      {KROKI_URL}
    </a>
  );
}

ReactDOM.createRoot(document.getElementById('kroki-url')).render(<KrokiHyperlink />);
