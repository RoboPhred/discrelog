# Circuit Graph Service

This service tracks the nodes that are part of the circuit from an editor point of view.
The circuit graph is agnostic to what circuits each node belongs to, all nodes across all circuits are treated as a collective.

A node is any component present in the circuit graph. It can be simulator elements, which perform logic operations,
or they can represent other facets like connections between different circuits or ICs that represent multiple elements.
