# Discrelog / React-Logic / Working Title Logic Thing

A discrete logic / circuit editor and simulator written in React and Redux.

_This is a work in progress, and will be for some time. It is not suitable for use as of this time._

## Live work-in-progress

_The interface is very much a prototype. The current incarnation is under heavy development and is not final._

http://robophred.github.io/discrelog

### Usage:

Click circuit elements on the left to create them. They will appear in the top-left corner.
Click an element to select it. Click-drag an element to move it, and click-drag the field to select multiple elements.

Selected elements appear with a small yellow square in the top left.

Connect components by clicking an output pin, then clicking an input pin. Only output-to-input clicks work, and an output must be re-clicked when connecting multiple inputs to an output.

### Controls:

* Select element: `left-click`
* Toggle element in current selection: `ctrl + left-click`
* Add element to current selection: `shift + left-click`
* Activate Button: `alt + left-click` or `option + left-click`
* Delete Element: `backspace` or `delete`
* Copy Selected: `ctrl + c` or `command + c`
* Paste: `ctrl + v` or `command + v`
* Next tick: `spacebar`
* Fast forward to next transition: `shift + spacebar`

## Circuit structure and Simulation

Circuits are built by connecting component output pins to input pins on a one-to-many relationship. A single output pin can connect to many input pins, but an input pin can only have a single output pin.

Connections and pins are represented by a binary state. A connection can be active (true) or inactive (false); there is no way to simulate analog concepts such as pull-low/pull-high, resistors, voltages, or currents.

When an output pin changes, all connected components are updated. The update process involves passing the entire state of its input pins, as well as the component's internal state, and allowed to produce an immediately-applied internal state change and a delay-applied output change. Changes to output pins must occur at least one tick in the future, and it is not possible to schedule more than one transition on the same output pin. This assures that logic signals steadily flow through on ticks, and allows such constructs as vibrators, latches, and flip-flops.

It is not possible for a component to change its pin on the current tick. This ensures components function consistently and predictably through cyclic connections and regardless of the order in which they update.

## Supported Logic Components

As of the time of this writing, the available logic components consist of:

* Combinational logic (4 tick response)
  * AND
  * OR
  * NOR
* Negate / NOT (4 tick response)
* Toggle Switch (1 tick response)
* Buffer (2 tick response)
* 7 Segment Display (immediate visual response)
* LED (immediate visual response)

_For more details on the implementation of logic components, and how to add your own, see [/services/simulator/node-types](https://github.com/RoboPhred/discrelog/tree/master/src/services/simulator/node-types)._

## Upcomming features

I am notorious for not getting back to things, so anything I write here would just be bad juju.

## Development Philosophy

While the inspiration for this project is a lack of high quality, easily extensible discrete logic simulators, this is a formost a learning exercise. This means progress will be slow and most of it will be rewritten many times over. Finding the best solution and gaining a deeper understanding of the underlying problem will take priority over bringing the software to a usable state. Do not expect fast progress or a user friendly editor for some time.

## Technology

This application is written to be a browser-ran desktop-scale application. It has no server component, and performs all work in the client's browser.
The UI renderer is React, with Redux providing the backing store.

## License

This project is licenced under AGPL-3.0.
The SVG paths that make up some node types are public domain and sourced from wikimedia commons. These have been called out where used.

## Alternatives

There are a few notable digital (and analog) circuit editors that I have come across and arbitrarily collected. Many more exist in the wild.

Open source:

* http://www.cburch.com/logisim/ (desktop app, java)
* https://github.com/willymcallister/circuit-sandbox (online, javascript, analog)

Closed source:

* https://www.circuitlab.com/ (online)
* https://simulator.io/ (online)
