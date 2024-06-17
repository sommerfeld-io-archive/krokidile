import React from 'react';
import ReactDOM from 'react-dom/client';
import * as monaco from 'monaco-editor';
import { PUmlExtension } from '@sinm/monaco-plantuml';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';

// see https://docs.kroki.io/kroki/setup/encode-diagram/#nodejs
const pako = require('pako');
const Buffer = require('buffer/').Buffer; // note the trailing slash

const KROKI_URL = 'https://kroki.io'; // todo https://github.com/sommerfeld-io/krokidile/issues/41

const DEFAULT_PUML = `@startuml

skinparam linetype ortho
skinparam monochrome false
skinparam componentStyle uml2
skinparam backgroundColor transparent
skinparam activity {
    'FontName Ubuntu
    FontName Roboto
}

actor User
component Component

User -right-> Component

@enduml
`;

//
// Setup Monaco Editor.
// Write contents from the local storage to the editor. If there is no content in the local
// storage, use the default content.
//
const editor = monaco.editor.create(document.getElementById('editor'), {
  value: localStorage.getItem('editorContent') || DEFAULT_PUML,
  language: 'plantuml',
  theme: 'vs-dark',
});

const extension = new PUmlExtension();
const disposer = extension.active(editor);

//
// Encode the diagram code. Prepare to send to kroki server.
//
function encodeDiagramCode(diagramCode) {
  const data = Buffer.from(diagramCode, 'utf8');
  const compressed = pako.deflate(data, { level: 9 });

  return Buffer.from(compressed).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

//
// Get the diagram code from the editor and send it to the Kroki service.
// The editor content ist stored in the local storage to make sure the content survives a page
// reload.
//
editor.onDidChangeModelContent(() => {
  const diagramCode = editor.getValue();
  localStorage.setItem('editorContent', diagramCode);

  if (!diagramCode) {
    console.log('Diagram code is empty');
    return;
  }

  fetch(`${KROKI_URL}/plantuml/svg/${encodeDiagramCode(diagramCode)}`)
    .then((response) => response.text())
    .then((imageResult) => {
      document.getElementById('preview').innerHTML = imageResult;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

//
// Render buttons to download sources and images.
//
function ActionsMenu() {
  var buttonStyle = 'btn-outline-secondary';
  var saveImageStyle = 'bi-download';
  return (
    <div class="btn-group" role="group" aria-label="actions-menu">
      <button type={`button`} className={`btn ${buttonStyle}`} onClick={() => downloadCode()}>
        <i className={`bi ${saveImageStyle}`}></i> Code
      </button>
      <button type={`button`} className={`btn ${buttonStyle}`} onClick={() => downloadSvg()}>
        <i className={`bi ${saveImageStyle}`}></i> SVG
      </button>
      <button type={`button`} className={`btn ${buttonStyle}`} onClick={() => downloadPng()}>
        <i className={`bi ${saveImageStyle}`}></i> PNG
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('actions-menu')).render(<ActionsMenu />);

//
// Download the contents of the editor as text file.
//
function downloadCode() {
  const fileName = 'code.puml';
  const diagramCode = editor.getValue();
  const blob = new Blob([diagramCode], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, fileName);
}

//
// Download the preview image as SVG.
//
function downloadSvg() {
  const fileName = 'diagram.svg';
  const diagramCode = editor.getValue();

  fetch(`${KROKI_URL}/plantuml/svg/${encodeDiagramCode(diagramCode)}`)
    .then((response) => response.text())
    .then((svgResult) => {
      const blob = new Blob([svgResult], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, fileName);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

//
// Download the preview image as PNG.
//
function downloadPng() {
  const fileName = 'diagram.png';
  const diagramCode = editor.getValue();

  fetch(`${KROKI_URL}/plantuml/png/${encodeDiagramCode(diagramCode)}`)
    .then((response) => response.blob())
    .then((pngResult) => {
      const url = URL.createObjectURL(pngResult);
      triggerDownload(url, fileName);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

//
// Trigger the actual download of the file.
//
function triggerDownload(url, fileName) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}

//
// Shortcut CTRL + s to download diagram code
//
document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    downloadCode();
  }
});
