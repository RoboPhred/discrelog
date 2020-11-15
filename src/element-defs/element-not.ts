import { ElementDefinition } from "./types";

const notElementDefinition: ElementDefinition = {
  type: "not",
  visual: {
    hitPath: `
    M28.96875 2.59375v44.8125l2.15625-1.0625 41.03125-20v-2.6875l-41.03125-20-2.15625-1.0625z
    `,
    // https://commons.wikimedia.org/wiki/File:NOT_ANSI.svg
    shapePath: `
      M79.15691 25H95
      M29.043478 25h-24
      M28.96875 2.59375v44.8125l2.15625-1.0625 41.03125-20v-2.6875l-41.03125-20-2.15625-1.0625z
      m3 4.8125L68.09375 25l-36.125 17.59375V7.40625z
      M79 25a4 4 0 1 1-8 0 4 4 0 1 1 8 0z
    `,
  },
  pins: {
    IN: {
      name: "IN",
      direction: "input",
      x: 0,
      y: 25,
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
        valuesByPin: { OUT: !inputs.IN },
      },
    };
  },
};
export default notElementDefinition;
