export const PUML_ENDPOINT = 'plantuml';
export const PUML_EDITOR_LANGUAGE = PUML_ENDPOINT;
export const PUML_MARKUP = `@startuml

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

// ------------------------------------------------------------------------------------------------

export const C4PUML_ENDPOINT = 'c4plantuml';
export const C4PUML_EDITOR_LANGUAGE = PUML_ENDPOINT;
export const C4PUML_MARKUP = `@startuml C4_Elements
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(personAlias, "Label", "Optional Description")
Container(containerAlias, "Label", "Technology", "Optional Description")
System(systemAlias, "Label", "Optional Description")

Rel(personAlias, containerAlias, "Label", "Optional Technology")
@enduml
`;

// ------------------------------------------------------------------------------------------------

export const DITAA_ENDPOINT = 'ditaa';
export const DITAA_EDITOR_LANGUAGE = 'plaintext';
export const DITAA_MARKUP = `
+------+    +-------+
|      |    |       |
| Some +----+ Stuff |
|      |    |       |
+------+    +-------+
`;

// ------------------------------------------------------------------------------------------------

export const BLOCKDIAG_ENDPOINT = 'blockdiag';
export const BLOCKDIAG_EDITOR_LANGUAGE = 'plaintext';
export const BLOCKDIAG_MARKUP = `blockdiag {
    blockdiag -> generates -> "block-diagrams";
    blockdiag -> is -> "very easy!";

    blockdiag [color = "greenyellow"];
    "block-diagrams" [color = "pink"];
    "very easy!" [color = "orange"];
}`;

// ------------------------------------------------------------------------------------------------

export const ERD_ENDPOINT = 'erd';
export const ERD_EDITOR_LANGUAGE = 'plaintext';
export const ERD_MARKUP = `[Person]
*name
+birth_location_id

[Location]
*id
city
state
country

Person *--1 Location`;

// ------------------------------------------------------------------------------------------------

export const RACKDIAG_ENDPOINT = 'rackdiag';
export const RACKDIAG_EDITOR_LANGUAGE = 'plaintext';
export const RACKDIAG_MARKUP = `rackdiag {
  16U;
  1: UPS [2U];
  3: Web Server;
  4: Web Server;
  5: Web Server;
  7: Load Balancer;
}`;
