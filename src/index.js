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
const DEFAULT_EDITOR_VALUE = ['@startuml', "' ...", '@enduml'].join('\n')

//
// Setup Monaco Editor.
// Write contents from the local storage to the editor. If there is no content in the local
// storage, use the default content.
//
const editor = monaco.editor.create(document.getElementById('editor'), {
  value: localStorage.getItem('editorContent') || DEFAULT_EDITOR_VALUE,
  language: 'plantuml',
  theme: 'vs-dark',
});

const extension = new PUmlExtension();
const disposer = extension.active(editor);

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

  const data = Buffer.from(diagramCode, 'utf8');
  const compressed = pako.deflate(data, { level: 9 });
  const encodedDiagramCode = Buffer.from(compressed)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  fetch(`${KROKI_URL}/plantuml/svg/${encodedDiagramCode}`)
    .then((response) => response.text())
    .then((imageResult) => {
      document.getElementById('preview').innerHTML = imageResult;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
