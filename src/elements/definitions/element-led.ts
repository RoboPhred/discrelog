import { createShapePathElement } from "../components/ShapePathElement";
import { ElementDefinition } from "../types";

function genCirclePath(cx: number, cy: number, r: number): string {
  return `M ${cx - r}, ${cy}
    a ${r},${r} 0 1,0 ${r * 2},0
    a ${r},${r} 0 1,0 ${-(r * 2)},0`;
}

interface LedState {
  value: boolean;
}

const path = genCirclePath(25, 25, 20);

const ledElementDefinition: ElementDefinition = {
  type: "led",
  visual: {
    hitPath: path,
    component: createShapePathElement({
      path,
      stroke: "black",
      strokeWidth: 3,
      fill: (state: LedState) => (state.value ? "lightgreen" : "darkgreen"),
    }),
  },
  pins: {
    IN: {
      name: "IN",
      direction: "input",
      x: 0,
      y: 25,
    },
  },
  evolve(state: LedState, inputs, tick) {
    return {
      state: {
        value: inputs.IN,
      },
    };
  },
};
export default ledElementDefinition;
