# Evolver Types

Evolvers define interaction and transition logic that elements use in the simulation.
There is not a 1-1 relationship between elements and evolvers. Some elements can create
multiple evolvers, some elements may have none.

For the visual items that are created with the UI, see [Elements](../elements/README.md).

## Terminology

- tick: A single time slice of the simulator. Unrelated to browser ticks.
- transition: A scheduled change of a element output pin.
- evolve: The process of determining the next element state and transitions, typically in response to a user interaction or change in input pin values.

## Logic

Evolvers define a function to accept input or user interaction, and emit a plan of future changes to their output.

When some external state changes (input pin state change, input pin wired/unwired, user interaction), an element will have the opportunity
to evolve its state by producing a transition for any of its output pins.

### Transitions

Evolvers change their outputs by requesting transitions during the evolution step.

Each output pin can only have one pending transition at a given time. If your evolver is called before a pin has transitioned,
setting a new transition to the pin will cancel and re-schedule the transition. The pin will mantain its pre-transition value until the next transition occurs.

A pin cannot be changed in the same tick that requests a change. Attempts to do so will schedule the change on the next tick.
