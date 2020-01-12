# TODO

- Implement seperate build and run modes.
  Collecting transitions on wire can reset when transitions occur,
  which can break time-sensitive circuits.
  Wiring should be done in a dedicated mode, and all nodes re-initialize
  when switching to run mode.

  - Update: We now have build and run modes, but live editing is still enabled.
    Might want to keep it that way, as its useful for experimentation.

- Circuit grouping
  Group a circuit into an IC.
  Functionally this still needs to produce nodeIds for the simulator as each
  node will have its own state.
  Editing one IC should change all copies.

  - Could be implemented by mapping nodeId to groupNodeId, so each instance
    of a shared IC node has the same groupNodeId. This will let us
    make the same change to a node across all nodes of the group.

- Make node connection points float above wires
  We have to put wires behind nodes as otherwise wires will block
  wire connection points, making it harder to wire up.
  However, we should put wires in front of nodes so we can
  rearrange wires going behind nodes.
  Do this by making another layer to render wire connection points, and place it
  after wires.
