# Discrelog / React-Logic / Working Title Logic Thing

A discrete logic / circuit editor and simulator written in React and Redux.

_This is a work in progress, and will be for some time. It is not suitable for use as of this time._

## Live work-in-progress

_The interface is very much a prototype. The current incarnation is under heavy development and is not final._

http://robophred.github.io/discrelog

### Usage:

Click circuit elements on the left to create them. They will appear in the top-left corner.
Click an element to select it. Click-drag an element to move it, and click-drag the field to select multiple elements.

Click on pins to select them. While a pin is selected, click on other pins to connect them. Output pins can only connect to input pins, and that input pins can only have one connection. Output pins can connect to more than one input pin.

Click+drag on wires to add wire joints, which can be used to route and organize wires. Click or drag-select joints to select them.

Click on wires (not wire joints) to select the entire wire.

### Controls:

On Mac, `command` replaces `ctrl` and `option` replaces `alt`.

- Select item: `left-click`
- Toggle item in current selection: `ctrl + left-click`
- Add item to current selection: `shift + left-click`
- Remove item from current selection: `ctrl + shift + left-click`
- Activate Button: `alt + left-click`
- Delete Selection: `backspace` or `delete`
- Copy Selected: `ctrl + c`
- Paste: `ctrl + v`
- Select All: `ctrl + a`
- Next tick: `spacebar`
- Fast forward to next transition: `shift + spacebar`

## Circuit structure and Simulation

Circuits are built by connecting component output pins to input pins on a one-to-many relationship. A single output pin can connect to many input pins, but an input pin can only have a single output pin.

Connections and pins are represented by a binary state. A connection can be active (true) or inactive (false); there is no way to simulate analog concepts such as pull-low/pull-high, resistors, voltages, or currents.

When an output pin changes, all connected components are updated. The update process involves computing the output pin states given the input pins and the component's internal state. The component will then immediately update its state, and schedule pin changes on a future update. Changes to output pins must occur at least one tick in the future, and it is not possible to schedule more than one transition on the same output pin. This ensures that logic remains predictable even in the case of loops, and allows such constructs as vibrators, latches, and flip-flops.

It is not possible for a component to change its pin on the current tick. This ensures components function consistently and predictably through cyclic connections and regardless of the order in which they update.

## Supported Logic Components

As of the time of this writing, the available logic components consist of:

- Combinational logic (4 tick response)
  - AND
  - OR
  - NOR
- Negate / NOT (4 tick response)
- Toggle Switch (1 tick response)
- Buffer (2 tick response)
- 7 Segment Display (immediate visual response)
- LED (immediate visual response)

_For more details on the implementation of logic components, and how to add your own, see [/node-types](https://github.com/RoboPhred/discrelog/tree/master/src/node-types)._

## Upcomming features

I am notorious for not getting back to things, so anything I write here would just be bad juju.

## Development Philosophy

While the inspiration for this project is a lack of high quality, easily extensible discrete logic simulators, this is a formost a learning exercise. This means progress will be slow and most of it will be rewritten many times over. Finding the best solution and gaining a deeper understanding of the underlying problem will take priority over bringing the software to a usable state. Do not expect fast progress or a user friendly editor for some time.

## Technology

This application is written to be a browser-ran desktop-scale application. It has no server component, and performs all work in the client's browser.
The UI renderer is React, with Redux providing the backing store.

## License

This project is licenced under AGPL-3.0.

Some logic symbol artwork has been provided by wikimedia commons under the public domain license. These have been called out where used.

## Alternatives

There are a few notable digital (and analog) circuit editors that I have come across and arbitrarily collected. Many more exist in the wild.

Open source:

- http://www.cburch.com/logisim/ (desktop app, java)
- https://github.com/willymcallister/circuit-sandbox (online, javascript, analog)

Closed source:

- https://www.circuitlab.com/ (online)
- https://simulator.io/ (online)
