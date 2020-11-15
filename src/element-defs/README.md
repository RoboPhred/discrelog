# Node Types

Node types define both the logic and the visual appearance of circuit nodes.

## Terminology

* tick: A single time slice of the simulator. Unrelated to browser ticks.
* transition: A scheduled change of a node output pin.
* evolve: The process of determining the next node state and transitions, typically in response to a user interaction or change in input pin values.

## Logic

Nodes define a function to accept input or user interaction, and emit a plan of future changes to their output.

When some external state changes (input pin state change, input pin wired/unwired, user interaction), a node will have the opportunity
to evolve its state by producing a transition for any of its output pins.

### Transitions

Nodes change their outputs by requesting transitions during the evolution step.

Each output pin can only have one pending transition at a given time. If your evolver is called before a pin has transitioned,
setting a new transition to the pin will cancel and re-schedule the transition.

A pin cannot be changed in the same tick that requests a change. Attempts to do so will schedule the change on the next tick.
The one exception to the above is when a node is first created. The first time evolve is called on a newly created node, all transitions
will immediately be applied. This is to prevent inconsistent states that will cause the circuit to function differently depending on the
order of node creation.

## Visual Appearance

Visual concerns are (mostly) under the visual key of the node definition, with the exception being the x/y coordinates of input and output pins.
Visuals are defined as svg path data with associated fill, stroke, and strokeWidth.
visual.shapePath can be a string, object, or an array of strings or objects.
If string, the string is interpreted as a svg path with a black stroke and strokeWidth of 1.
If an object, the object must have a key of "path" with the svg path data, and may optionally have fill, stroke, and strokePath properties. The fill/stroke/strokeWidth properties can either be a constant, or a function accepting a node state.

By default, the hit area for mouse interaction of the node will be generated from the sum of all paths.
To specify a custom hit area, set the 'hitPath' property to an svg path describing the area you want the shape to respond to.
