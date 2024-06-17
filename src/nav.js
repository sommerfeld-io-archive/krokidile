import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';

const KROKI_URL = 'https://kroki.io'; // todo https://github.com/sommerfeld-io/krokidile/issues/41

//
// The main navigation.
//
function MainNav() {
  return (
    <ul class="nav nav-pills flex-column mb-auto">
      <NavLink
        href="https://github.com/sommerfeld-io/krokidile/tree/main/docs/modules/ROOT/pages"
        text="Documentation"
        icon="file-earmark-text"
        color="white"
      />
      <NavLink
        href="https://github.com/sommerfeld-io/krokidile"
        text="GitHub Repository"
        icon="github"
        color="white"
      />
      <NavLink
        href="https://github.com/sommerfeld-io/krokidile/blob/main/docs/modules/ROOT/pages/terms.adoc"
        text="Terms of Use"
        icon="github"
        color="white"
      />
    </ul>
  );
}

//
// The external navigation containing links to docs pages etc.
//
function ExternalNav() {
  return (
    <ul class="nav nav-pills flex-column mb-auto">
      <NavLink
        href="https://plantuml.com/de/deployment-diagram"
        text="PlantUML.com Docs"
        icon="arrow-up-right-square"
        color="secondary"
      />
      <NavLink
        href="https://crashedmind.github.io/PlantUMLHitchhikersGuide/index.html"
        text="PlantUML Guide"
        icon="arrow-up-right-square"
        color="secondary"
      />
    </ul>
  );
}

//
// The meta navigation containing links to services which are used by the app. Plus some additional information.
//
function MetaNav() {
  return (
    <ul class="nav nav-pills flex-column mb-auto">
      <NavLink href={KROKI_URL} text={KROKI_URL} icon="info-circle" color="secondary" />
    </ul>
  );
}

//
// Render the actual navigation link.
//
function NavLink(props) {
  return (
    <li>
      <a href={props.href} className={`nav-link text-${props.color}`}>
        <i className={`bi pe-none me-2 bi-${props.icon}`}></i>
        {props.text}
      </a>
    </li>
  );
}

ReactDOM.createRoot(document.getElementById('main-nav')).render(<MainNav />);
ReactDOM.createRoot(document.getElementById('external-nav')).render(<ExternalNav />);
ReactDOM.createRoot(document.getElementById('meta-nav')).render(<MetaNav />);

//
// Select different diagram types for the editor.
//
function DiagramTypeSelector() {
  return (
    <div>
      <DiagramTypeRadio id="c4plantuml" label="C4 PlantUML" />
      <DiagramTypeRadio id="plantuml" label="PlantUML" />
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
        class="btn-check"
        name="diagram-type-option"
        id={`${props.id}`}
        autocomplete="off"
        checked
      />
      <label className={`btn ${buttonStyle} ${buttonSize}`} for={`${props.id}`}>
        {props.label}
      </label>
    </span>
  );
}

ReactDOM.createRoot(document.getElementById('diagram-type-selector')).render(
  <DiagramTypeSelector />,
);
