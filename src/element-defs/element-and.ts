import { ElementDefinition } from "./types";

const andElementDefinition: ElementDefinition = {
  type: "and",
  visual: {
    hitPath: `
      M30 5V45H50.47619c11.267908 0 20-9.000045 20-20s-8.732091-20-20-20H30z
    `,
    // https://commons.wikimedia.org/wiki/File:AND_ANSI.svg
    shapePath: `
      M70 25h25
      M31 15H5
      M32 35H5
      M30 5V45H50.47619c11.267908 0 20-9.000045 20-20s-8.732091-20-20-20H30z
      m2.857143 2.857143H50.47619c9.760663 0 16.666667 7.639955 16.666667 17.142857 0 9.502902-7.382195 17.142857-17.142857 17.142857H32.857143V7.857143z
    `,
  },
  pins: {
    A: {
      name: "A",
      direction: "input",
      x: 0,
      y: 14.5,
    },
    B: {
      name: "B",
      direction: "input",
      x: 0,
      y: 35,
    },
    OUT: {
      name: "OUT",
      direction: "output",
      x: 100,
      y: 25,
    },
  },
  evolve(state, inputs, tick) {
    return {
      transitions: {
        tickOffset: 4,
        valuesByPin: { OUT: inputs.A && inputs.B },
      },
    };
  },
};
export default andElementDefinition;