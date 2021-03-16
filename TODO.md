# FIXME

- Nodes from multiple windows can be simultaniously selected, allowing a drag operation to drag nodes across multiple windows.
  - Selection should be per-CircuitEditor
    - Could be local to the CircuitEditor component, but then again it would be nice to control the selection using actions, such as selecting the affected nodes on undo/redo, or selecting a node when double clicking on the node in a list
    - To keep it affected by actions, each circuit editor should have its own state stored in redux somewhere. I played around with giving each circuit editor its own id, but didn't really like the result. Needs more experimentation.
  - Drag logic might be per-CircuitEditor, depending on how selection is implemented.

# TODO

- Blank placeholder window when all circuit editor windows are closed.
  - Default to this blank window rather than assuming a default window in both circuit-editors and ui-layout services.
- Tooltip on hover over sim controls showing the hotkeys.
- Breakpoints on pin value changes

- Multi window causes confusion with undo

  - Undo is global, but most uis have undo per window
  - We cannot do undo per-window in case an undo in one window breaks the situation for undo in another
  - Might be possible if instead of snapshotting, we keep note of exactly what actions are done and have code to check the possibility of and and reverse the action.

- IC test mode

  - Open a dialog that shows an IC with buttons on inputs and LEDs on outputs. Allow for testing ICs in isolation on the fly
  - Requires splitting simulator logic out of simulator service.

- Education mode

  - Tutorials and lessons stored in app. Lesson provides a truth table or histogram and requires one to build a circuit to match it.
  - Requires the ability for root circuit to have inputs and outputs driven by the lesson.

- Histogram

  - Mark node pins for inclusion in a histogram showing the logic levels of the pin as the simulator runs.
  - Maybe instead of marking pins, have a debug / test port node to wire up. Each node creates a histogram entry.
  - Need to limit entries in histogram due to vibrators. Keep 100 transitions, and show dashed middle-height line for unknown previous values.

- re-reselect caches items forever, nothing ever clears out the cache. Might want to put a LRU on it.
