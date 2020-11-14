import { NodeDefinition } from "./types";

function genCirclePath(cx: number, cy: number, r: number): string {
  return `M ${cx - r}, ${cy}
    a ${r},${r} 0 1,0 ${r * 2},0
    a ${r},${r} 0 1,0 ${-(r * 2)},0`;
}

const ledNodeDefinition: NodeDefinition = {
  type: "led",
  visual: {
    shapePath: [
      genCirclePath(25, 25, 25),
      {
        path: genCirclePath(25, 25, 20),
        fill: (state) => (state.value ? "lightgreen" : "darkgreen"),
      },
    ],
  },
  pins: {
    IN: {
      name: "IN",
      direction: "input",
      x: 0,
      y: 25,
    },
  },
  evolve(state, inputs, tick) {
    return {
      state: {
        value: inputs.IN,
      },
    };
  },
};
export default ledNodeDefinition;
