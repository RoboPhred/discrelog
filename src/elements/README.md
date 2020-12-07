# Element Types

Element types define both the logic and the visual appearance of circuit elements.

## Terminology

- tick: A single time slice of the simulator. Unrelated to browser ticks.
- transition: A scheduled change of a element output pin.
- evolve: The process of determining the next element state and transitions, typically in response to a user interaction or change in input pin values.

## Logic

Elements define a function to accept input or user interaction, and emit a plan of future changes to their output.

When some external state changes (input pin state change, input pin wired/unwired, user interaction), a element will have the opportunity
to evolve its state by producing a transition for any of its output pins.

### Transitions

Elements change their outputs by requesting transitions during the evolution step.

Each output pin can only have one pending transition at a given time. If your evolver is called before a pin has transitioned,
setting a new transition to the pin will cancel and re-schedule the transition. The pin will mantain its pre-transition value until the next transition occurs.

A pin cannot be changed in the same tick that requests a change. Attempts to do so will schedule the change on the next tick.

## Visual Appearance

Visual concerns are (mostly) under the visual key of the element definition, with the exception being the x/y coordinates of input and output pins.
Visuals are defined as svg path data with associated fill, stroke, and strokeWidth.
visual.shapePath can be a string, object, or an array of strings or objects.
If string, the string is interpreted as a svg path with a black stroke and strokeWidth of 1.
If an object, the object must have a key of "path" with the svg path data, and may optionally have fill, stroke, and strokePath properties. The fill/stroke/strokeWidth properties can either be a constant, or a function accepting a element state.

By default, the hit area for mouse interaction of the element will be generated from the sum of all paths.
To specify a custom hit area, set the 'hitPath' property to an svg path describing the area you want the shape to respond to.
