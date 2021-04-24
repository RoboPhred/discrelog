# TODO

- Slider to control speed of simulation.
- Blank placeholder window when all circuit editor windows are closed.
  - Default to this blank window rather than assuming a default window in both circuit-editors and ui-layout services.
- Tooltip on hover over sim controls showing the hotkeys.
- Breakpoints on pin value changes
- Progress bar effect on logic elements to show how many ticks left until they update given the current input.
- Support dragging elements across windows.
- If all circuit editors are closed, open a new editor on clicking a circuit.
- Cut command

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

  - Mark element pins for inclusion in a histogram showing the logic levels of the pin as the simulator runs.
  - Maybe instead of marking pins, have a debug / test port element to connect up. Each element creates a histogram entry.
  - Need to limit entries in histogram due to vibrators. Keep 100 transitions, and show dashed middle-height line for unknown previous values.

- re-reselect caches items forever, nothing ever clears out the cache. Might want to put a LRU on it.
