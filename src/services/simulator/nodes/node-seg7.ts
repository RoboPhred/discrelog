
import { typedKeys } from "@/utils";

import { NodeDefinition, NodeVisualPathDefinition } from "../types";
const SCALE = 3;
const OFFSET = [15, 0];

function createSeg(name: string, points: [number, number][]): NodeVisualPathDefinition {
  const start = points[0];
  let path = `M${start[0] * SCALE + OFFSET[0]},${start[1] * SCALE + OFFSET[1]}`;
  for (let p of points.slice(1)) {
    const [x, y] = p;
    path += `L${x * SCALE + OFFSET[0]},${y * SCALE + OFFSET[1]}`
  }
  path += 'z';
  return {
    path,
    fill: state => state[name] ? "red" : "blue"
  };
}

const seg7NodeDefinition: NodeDefinition = {
  type: "seg7",
  visual: {
    hitPath: `V63 H45 V0 z`,
    // https://commons.wikimedia.org/wiki/File:7-segment_abcdefg.svg
    shapePath: [
      createSeg("A", [[1, 1], [2, 0], [8, 0], [9, 1], [8, 2], [2, 2]]),
      createSeg("B", [[9, 1], [10, 2], [10, 8], [9, 9], [8, 8], [8, 2]]),
      createSeg("C", [[9, 9], [10, 10], [10, 16], [9, 17], [8, 16], [8, 10]]),
      createSeg("D", [[9, 17], [8, 18], [2, 18], [1, 17], [2, 16], [8, 16]]),
      createSeg("E", [[1, 17], [0, 16], [0, 10], [1, 9], [2, 10], [2, 16]]),
      createSeg("F", [[1, 9], [0, 8], [0, 2], [1, 1], [2, 2], [2, 8]]),
      createSeg("G", [[1, 9], [2, 8], [8, 8], [9, 9], [8, 10], [2, 10]])
    ]
  },
  inputs: {
    A: {
      name: "A",
      x: 0,
      y: 5
    },
    B: {
      name: "B",
      x: 0,
      y: 15
    },
    C: {
      name: "C",
      x: 0,
      y: 25
    },
    D: {
      name: "D",
      x: 0,
      y: 35
    },
    E: {
      name: "E",
      x: 0,
      y: 45
    },
    F: {
      name: "F",
      x: 0,
      y: 55
    },
    G: {
      name: "G",
      x: 0,
      y: 65
    },
  },
  outputs: {},
  evolve(state, inputs, tick) {
    return {
      state: { ...inputs }
    };
  }
};
export default seg7NodeDefinition;
