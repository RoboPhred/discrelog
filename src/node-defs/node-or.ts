import { NodeDefinition } from "./types";

const orNodeDefinition: NodeDefinition = {
  type: "or",
  visual: {
    hitPath: `
    M24.09375 5l2 2.4375S31.75 14.437549 31.75 25s-5.65625 17.5625-5.65625 17.5625l-2 2.4375H41.25c2.408076.000001 7.689699.024514 13.625-2.40625s12.536536-7.343266 17.6875-16.875L71.25 25l1.3125-.71875C62.259387 5.21559 46.006574 5 41.25 5H24.09375z
    `,
    // https://commons.wikimedia.org/wiki/File:OR_ANSI.svg
    shapePath: `
      M70 25h25
      M31 15H5
      M32 35H5
      M24.09375 5l2 2.4375S31.75 14.437549 31.75 25s-5.65625 17.5625-5.65625 17.5625l-2 2.4375H41.25c2.408076.000001 7.689699.024514 13.625-2.40625s12.536536-7.343266 17.6875-16.875L71.25 25l1.3125-.71875C62.259387 5.21559 46.006574 5 41.25 5H24.09375z
      m5.875 3H41.25c4.684173 0 18.28685-.130207 27.96875 17C64.451964 33.429075 58.697469 37.68391 53.5 39.8125 48.139339 42.007924 43.658075 42.000001 41.25 42H30c1.873588-3.108434 4.75-9.04935 4.75-17 0-7.973354-2.908531-13.900185-4.78125-17z
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
        valuesByPin: { OUT: inputs.A || inputs.B },
      },
    };
  },
};
export default orNodeDefinition;
