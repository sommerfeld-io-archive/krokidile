import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <p>I will be a plantuml live editor</p>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('editor'));
