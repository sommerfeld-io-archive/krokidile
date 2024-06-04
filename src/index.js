import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// todo https://github.com/sommerfeld-io/krokidile/issues/41  
const krokiUrl = "https://kroki.io";

document.getElementById('diagram-code').addEventListener('input', async function(e) {
  const diagramCode = e.target.value;
  
  if (!diagramCode) {
    console.error('Diagram code is empty');
    return;
  }

  const encodedDiagramCode = btoa(encodeURIComponent(diagramCode));

  const response = await fetch(`${krokiUrl}/plantuml/svg/${encodedDiagramCode}`);
  const imageUrl = await response.text();
  document.getElementById('preview').innerHTML = `<img src="${imageUrl}" alt="Diagram Preview" />`;
});

function KrokiUrl() {
  return (
    <a href={krokiUrl}>
      {krokiUrl}
    </a>
  );
}

ReactDOM.render(<KrokiUrl />, document.getElementById('kroki-url'));
