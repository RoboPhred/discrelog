# Circuit Graph Service

This service tracks the elements that are part of the circuit from an editor point of view.
The circuit graph is agnostic to what circuits each element belongs to, all elements across all circuits are treated as a collective.

An element is any component present in the circuit graph. It can be simulator elements, which perform logic operations,
or they can represent other facets like connections between different circuits or ICs that represent multiple elements.
