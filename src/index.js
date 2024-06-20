import React from 'react';
import ReactDOM from 'react-dom/client';
import * as monaco from 'monaco-editor';
import { PUmlExtension } from '@sinm/monaco-plantuml';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';
import * as diagramTypes from './diagram-type-data.js';

// see https://docs.kroki.io/kroki/setup/encode-diagram/#nodejs
const pako = require('pako');
const Buffer = require('buffer/').Buffer; // note the trailing slash

const KROKI_URL = 'https://kroki.io'; // todo https://github.com/sommerfeld-io/krokidile/issues/41
const SELECTED_DIAGRAM_TYPE =
  localStorage.getItem('selectedDiagramType') || diagramTypes.PUML_ENDPOINT;

// Set the default content for the editor based on the selected diagram type.
var DEFAULT_EDITOR_CONTENT = diagramTypes.PUML_MARKUP;
var DEFAULT_EDITOR_LANGUAGE = diagramTypes.PUML_EDITOR_LANGUAGE;

if (SELECTED_DIAGRAM_TYPE === diagramTypes.PUML_ENDPOINT) {
  DEFAULT_EDITOR_CONTENT = diagramTypes.PUML_MARKUP;
  DEFAULT_EDITOR_LANGUAGE = diagramTypes.PUML_EDITOR_LANGUAGE;
} else if (SELECTED_DIAGRAM_TYPE === diagramTypes.C4PUML_ENDPOINT) {
  DEFAULT_EDITOR_CONTENT = diagramTypes.C4PUML_MARKUP;
  DEFAULT_EDITOR_LANGUAGE = diagramTypes.C4PUML_EDITOR_LANGUAGE;
} else if (SELECTED_DIAGRAM_TYPE === diagramTypes.DITAA_ENDPOINT) {
  DEFAULT_EDITOR_CONTENT = diagramTypes.DITAA_MARKUP;
  DEFAULT_EDITOR_LANGUAGE = diagramTypes.DITAA_EDITOR_LANGUAGE;
} else if (SELECTED_DIAGRAM_TYPE === diagramTypes.BLOCKDIAG_ENDPOINT) {
  DEFAULT_EDITOR_CONTENT = diagramTypes.BLOCKDIAG_MARKUP;
  DEFAULT_EDITOR_LANGUAGE = diagramTypes.BLOCKDIAG_EDITOR_LANGUAGE;
} else if (SELECTED_DIAGRAM_TYPE === diagramTypes.ERD_ENDPOINT) {
  DEFAULT_EDITOR_CONTENT = diagramTypes.ERD_MARKUP;
  DEFAULT_EDITOR_LANGUAGE = diagramTypes.ERD_EDITOR_LANGUAGE;
}

//
// Setup Monaco Editor.
// Write contents from the local storage to the editor. If there is no content in the local
// storage, use the default content.
//
const editor = monaco.editor.create(document.getElementById('editor'), {
  value: localStorage.getItem('editorContent') || DEFAULT_EDITOR_CONTENT,
  language: DEFAULT_EDITOR_LANGUAGE,
  theme: 'vs-dark',
});

// Activate extensions for the editor to ptovide syntax highlighting and auto-completion.
if (SELECTED_DIAGRAM_TYPE === diagramTypes.PUML_ENDPOINT) {
  const extension = new PUmlExtension();
  const disposer = extension.active(editor);
} else if (SELECTED_DIAGRAM_TYPE === diagramTypes.C4PUML_ENDPOINT) {
  const extension = new PUmlExtension();
  const disposer = extension.active(editor);
} else if (SELECTED_DIAGRAM_TYPE === diagramTypes.DITAA_ENDPOINT) {
  // nothing yet
} else if (SELECTED_DIAGRAM_TYPE === diagramTypes.BLOCKDIAG_ENDPOINT) {
  // nothing yet
} else if (SELECTED_DIAGRAM_TYPE === diagramTypes.ERD_ENDPOINT) {
  // nothing yet
}

//
// Encode the diagram code. Prepare to send to kroki server.
//
function encodeDiagramCode(diagramCode) {
  const data = Buffer.from(diagramCode, 'utf8');
  const compressed = pako.deflate(data, { level: 9 });

  return Buffer.from(compressed).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

//
// Get the diagram code from the editor and send it to the Kroki service. Send the code only when
// there is no change in the editor content for a defined amount of seconds. This is to avoid
//  sending too many requests to the Kroki service.
//
// The editor content ist stored in the local storage to make sure the content survives a page
// reload.
//
let debounceTimeout;
let milliseconds = 1000;
editor.onDidChangeModelContent(() => {
  const diagramCode = editor.getValue();
  localStorage.setItem('editorContent', diagramCode);

  if (!diagramCode) {
    console.log('Diagram code is empty');
    return;
  }

  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    fetch(`${KROKI_URL}/${SELECTED_DIAGRAM_TYPE}/svg/${encodeDiagramCode(diagramCode)}`)
      .then((response) => response.text())
      .then((imageResult) => {
        document.getElementById('preview').innerHTML = imageResult;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, milliseconds);
});

//
// Render buttons to download sources and images.
//
function ActionsMenu() {
  var buttonStyle = 'btn-outline-light';
  var saveImageStyle = 'bi-download';
  return (
    <div className={`btn-group`} role="group" aria-label="actions-menu">
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
  const fileName = 'code.txt';
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

  fetch(`${KROKI_URL}/${SELECTED_DIAGRAM_TYPE}/svg/${encodeDiagramCode(diagramCode)}`)
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

  fetch(`${KROKI_URL}/${SELECTED_DIAGRAM_TYPE}/png/${encodeDiagramCode(diagramCode)}`)
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

//
// Select different diagram types for the editor.
// ID must match the endpoint in the Kroki service.
//
function DiagramTypeSelector() {
  return (
    <div>
      <DiagramTypeRadio id={`${diagramTypes.BLOCKDIAG_ENDPOINT}`} label="BlockDiag" />
      <DiagramTypeRadio id={`${diagramTypes.C4PUML_ENDPOINT}`} label="C4 PlantUML" />
      <DiagramTypeRadio id={`${diagramTypes.DITAA_ENDPOINT}`} label="Ditaa" />
      <DiagramTypeRadio id={`${diagramTypes.ERD_ENDPOINT}`} label="Erd" />
      <DiagramTypeRadio id={`${diagramTypes.PUML_ENDPOINT}`} label="PlantUML" />
    </div>
  );
}

//
// Render the radio button for the diagram type.
//
function DiagramTypeRadio(props) {
  var buttonStyle = 'btn-outline-white';
  var buttonSize = 'btn-sm';
  return (
    <span>
      <input
        type="radio"
        className={`btn-check`}
        name="diagram-type-option"
        id={`${props.id}`}
        autoComplete="off"
        defaultChecked={SELECTED_DIAGRAM_TYPE === props.id}
        onChange={() => {
          localStorage.setItem('selectedDiagramType', `${props.id}`);
          window.location.reload();
        }}
      />
      <label className={`btn ${buttonStyle} ${buttonSize}`} htmlFor={`${props.id}`}>
        {props.label}
      </label>
    </span>
  );
}

ReactDOM.createRoot(document.getElementById('diagram-type-selector')).render(
  <DiagramTypeSelector />,
);
