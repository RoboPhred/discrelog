# Discrelog / React-Logic / Working Title Logic Thing

A discrete logic / circuit editor and simulator written in React and Redux.

## Visit the Live Site

http://discrelog.io

### Usage

#### Editing

Drag circuit elements from the elements tray to the field to create them.
Click an element to select it. Click-drag an element to move it, and click-drag the field to select multiple elements.

Click and drag between pins to connect them. An output pin (circular) can connect to multiple input pins (arcs), but each input pin may only be connected to one output pin.

Click+drag on wires to add wire joints, which can be used to route and organize wires. Click or drag-select joints to select them.

Click on wires (not wire joints) to select the entire wire.

Right click in the circuit list (right hand side) to create new circuits. Circuits will appear as ICs for use in other circuits. Use input and output pin elements to create corresponding input
and output pins on the IC.

#### Running

Press the play button in the top right to compile and run your circuit. During operation, you can click on buttons to toggle their state.

Double click on ICs to view the state of the circuit for that specific ICs. Clicking on a circuit in the circuit list will not show live values,
as it will not have any instance of the IC to reflect.

### Editing Controls

On Mac, `command` replaces `ctrl`.

- Select item: `left-click`
- Toggle item in current selection: `ctrl + left-click`
- Add item to current selection: `shift + left-click`
- Remove item from current selection: `ctrl + shift + left-click`
- Delete Selection: `backspace` or `delete`
- Select All in Circuit: `ctrl + a`
- Copy Selected: `ctrl + c`
- Paste: `ctrl + v`
- Undo: `ctrl + z`
- Redo: `ctrl + shift + z` or `ctrl + y`

### Running controls

- Activate button elements: `left-click`
- Next tick (when paused): `spacebar`
- Fast forward to next transition (when paused): `shift + spacebar`
- View IC circuit: `double-click`

## Circuit structure and Simulation

Circuits are built by connecting component output pins to input pins on a one-to-many relationship. A single output pin can connect to many input pins, but an input pin can only have a single output pin.

Connections and pins are represented by a binary state. A connection can be active (true) or inactive (false); there is no way to simulate analog concepts such as pull-low/pull-high, resistors, voltages, or currents.

When an output pin changes, all connected components are updated. The update process involves computing the output pin states given the input pins and the component's internal state. The component will then immediately update its state, and schedule pin changes on a future update. Changes to output pins must occur at least one tick in the future, and it is not possible to schedule more than one transition on the same output pin. This ensures that logic remains predictable even in the case of loops, and allows such constructs as vibrators, latches, and flip-flops.

It is not possible for a component to change its pin on the current tick. This ensures components function consistently and predictably through cyclic connections and regardless of the order in which they update.

## Supported Logic Components

As of the time of this writing, the available logic components consist of:

- Combinational logic (4 tick response)
  - AND
  - NAND
  - OR
  - NOT
  - NOR
  - XOR
- Toggle Switch (1 tick response)
- Buffer (4 tick response)
- 7 Segment Display (immediate visual response)
- LED (immediate visual response)
- IC Pins (used on circuits to create ICs)
  - Input Pin
  - Output Pin

## Upcomming features

The ultimate aim of this software is still up in the air.

Possible upcomming features:

- Histogram showing logic levels over time.
- Custom body shapes for ICs.

Possible directions for this project include:

- Educational mode giving logic puzzles that must be solved with circuits.
- Editable fixed-element LCD displays and button grids to build a hardware-esque user interface to the circuit.

## Development Philosophy

While the inspiration for this project is a lack of high quality, easily extensible discrete logic simulators, this is a formost a learning exercise. This means progress will be slow and most of it will be rewritten many times over. Finding the best solution and gaining a deeper understanding of the underlying problem will take priority over bringing the software to a usable state. Do not expect fast progress or a user friendly editor for some time.

## Technology

This application is being written to deliver a desktop quality application from within modern browsers. It has no server component, and performs all work in the user's browser.
The UI renderer is React, with Redux providing the backing store.

## License

This project is licenced under AGPL-3.0.

Some logic symbol artwork has been provided by wikimedia commons under the public domain license. These have been called out where used.

## Alternatives

These are a few notable digital (and analog) circuit editors that I have come across and arbitrarily collected. More may exist in the wild.

Open source:

- http://www.cburch.com/logisim/ (desktop app, java)
- https://github.com/willymcallister/circuit-sandbox (online, javascript, analog)

Closed source:

- https://www.circuitlab.com/ (online)
- https://simulator.io/ (online)
