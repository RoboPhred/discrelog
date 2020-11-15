import { ElementDefinition, ElementVisualPathDefinition } from "./types";

const SCALE = 3;
const OFFSET = [15, 0];

/**
 * Produce a visual path definition of a segment given a series of polygon points.
 * The path definition will color itself based on the state key specified by 'name'
 * @param name The state key to select color based on.  The key should represent a boolean value.
 * @param points An array of [x,y] pairs that make up the polygon.
 */
function createSeg(
  name: string,
  points: [number, number][]
): ElementVisualPathDefinition {
  const start = points[0];
  let path = `M${start[0] * SCALE + OFFSET[0]},${start[1] * SCALE + OFFSET[1]}`;
  for (let p of points.slice(1)) {
    const [x, y] = p;
    path += `L${x * SCALE + OFFSET[0]},${y * SCALE + OFFSET[1]}`;
  }
  path += "z";
  return {
    path,
    fill: (state) => (state[name] ? "red" : "gray"),
  };
}

const seg7ElementDefinition: ElementDefinition = {
  type: "seg7",
  visual: {
    hitPath: `M0,0 V63 H45 V0 z`,
    // https://commons.wikimedia.org/wiki/File:7-segment_abcdefg.svg
    shapePath: [
      createSeg("A", [
        [1, 1],
        [2, 0],
        [8, 0],
        [9, 1],
        [8, 2],
        [2, 2],
      ]),
      createSeg("B", [
        [9, 1],
        [10, 2],
        [10, 8],
        [9, 9],
        [8, 8],
        [8, 2],
      ]),
      createSeg("C", [
        [9, 9],
        [10, 10],
        [10, 16],
        [9, 17],
        [8, 16],
        [8, 10],
      ]),
      createSeg("D", [
        [9, 17],
        [8, 18],
        [2, 18],
        [1, 17],
        [2, 16],
        [8, 16],
      ]),
      createSeg("E", [
        [1, 17],
        [0, 16],
        [0, 10],
        [1, 9],
        [2, 10],
        [2, 16],
      ]),
      createSeg("F", [
        [1, 9],
        [0, 8],
        [0, 2],
        [1, 1],
        [2, 2],
        [2, 8],
      ]),
      createSeg("G", [
        [1, 9],
        [2, 8],
        [8, 8],
        [9, 9],
        [8, 10],
        [2, 10],
      ]),
    ],
  },
  pins: {
    A: {
      name: "A",
      direction: "input",
      x: 0,
      y: 5,
    },
    B: {
      name: "B",
      direction: "input",
      x: 0,
      y: 15,
    },
    C: {
      name: "C",
      direction: "input",
      x: 0,
      y: 25,
    },
    D: {
      name: "D",
      direction: "input",
      x: 0,
      y: 35,
    },
    E: {
      name: "E",
      direction: "input",
      x: 0,
      y: 45,
    },
    F: {
      name: "F",
      direction: "input",
      x: 0,
      y: 55,
    },
    G: {
      name: "G",
      direction: "input",
      x: 0,
      y: 65,
    },
  },
  evolve(state, inputs, tick) {
    return {
      state: { ...inputs },
    };
  },
};
export default seg7ElementDefinition;
