import { NodeDefinition } from "./types";

const bufferNodeDefinition: NodeDefinition = {
  type: "buffer",
  visual: {
    hitPath: `
    M 28.96875,2.59375 L 28.96875,5 L 28.96875,45 L 28.96875,47.40625 L 31.125,46.34375 L 72.15625,26.34375 L 75,25 L 72.15625,23.65625 L 31.125,3.65625 L 28.96875,2.59375 z
    `,
    // https://commons.wikimedia.org/wiki/File:Buffer_ANSI.svg
    shapePath: `
      M 72,25 L 95.085706,25
      M 29.043478,25 L 5.0434781,25
      M 28.96875,2.59375 L 28.96875,5 L 28.96875,45 L 28.96875,47.40625 L 31.125,46.34375 L 72.15625,26.34375 L 75,25 L 72.15625,23.65625 L 31.125,3.65625 L 28.96875,2.59375 z M 31.96875,7.40625 L 68.09375,25 L 31.96875,42.59375 L 31.96875,7.40625 z
    `
  },
  inputs: {
    IN: {
      name: "IN",
      x: 0,
      y: 25
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
    return {
      transitions: {
        OUT: {
          tickOffset: 4,
          value: inputs.IN
        }
      }
    };
  }
};
export default bufferNodeDefinition;
