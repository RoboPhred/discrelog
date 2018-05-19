import { EvolutionResult, NodeDefinition } from "../types";

const andNodeDefinition: NodeDefinition = {
  type: "and",
  visual: {
    // https://commons.wikimedia.org/wiki/File:AND_ANSI.svg
    hitPath: `
      M30 5V45H50.47619c11.267908 0 20-9.000045 20-20s-8.732091-20-20-20H30z
    `,
    shapePath: `
      M70 25h25
      M31 15H5
      M32 35H5
      M30 5V45H50.47619c11.267908 0 20-9.000045 20-20s-8.732091-20-20-20H30z
      m2.857143 2.857143H50.47619c9.760663 0 16.666667 7.639955 16.666667 17.142857 0 9.502902-7.382195 17.142857-17.142857 17.142857H32.857143V7.857143z
    `
  },
  inputs: {
    A: {
      name: "A",
      x: 0,
      y: 14.5
    },
    B: {
      name: "B",
      x: 0,
      y: 35
    }
  },
  outputs: {
    OUT: {
      name: "OUT",
      x: 100,
      y: 25
    }
  },
  evolve(state, inputs, tick) {
    const result: EvolutionResult = {
      transitions: [
        {
          outputId: "OUT",
          tickOffset: 4,
          value: inputs.A && inputs.B
        }
      ]
    };
    return result;
  }
};
export default andNodeDefinition;
