# Node Types

Nodes are the items created by the user using the UI. They are processed by the simulator graph to produce [elements](../elements/README.md), which perform the logical operations.

## Visual Appearance

Nodes can supply custom react components to render their visual appearance.

FIXME: Nodes get the state of the underlying element, but it is planned to create multiple elements per node for ICs. Need to find a solution that lets LED and seg7 still get their state.

For convienence, the helper function createShapePathNode can create a component based around svg paths, styled by the underlying element's state.

## Hit Path

Nodes need to supply an svg hit path to define their clickable area.
FIXME: This is a bit out of date. Currently only needed for sizing the nodes in the node tray and dealing with drag select. Both usages condense it down to a hitbox and ignore path data.
