# TODO

- Implement seperate build and run modes.
  Collecting transitions on wire can reset when transitions occur,
  which can break time-sensitive circuits.
  Wiring should be done in a dedicated mode, and all nodes re-initialize
  when switching to run mode.
