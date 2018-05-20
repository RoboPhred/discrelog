import { EvolutionResult, NodeDefinition } from "../types";

const orNodeDefinition: NodeDefinition = {
  type: "not",
  visual: {
    // https://commons.wikimedia.org/wiki/File:NOT_ANSI.svg
    hitPath: `
      M28.96875 2.59375v44.8125l2.15625-1.0625 41.03125-20v-2.6875l-41.03125-20-2.15625-1.0625z
    `,
    shapePath: `
      M79.15691 25H95
      M29.043478 25h-24
      M28.96875 2.59375v44.8125l2.15625-1.0625 41.03125-20v-2.6875l-41.03125-20-2.15625-1.0625z
      m3 4.8125L68.09375 25l-36.125 17.59375V7.40625z
      M79 25a4 4 0 1 1-8 0 4 4 0 1 1 8 0z
    `
  },
  inputs: {
    IN: {
      name: "IN",
      x: 0,
      y: 25
    },
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
          value: !inputs.IN
        }
      ]
    };
    return result;
  }
};
export default orNodeDefinition;
