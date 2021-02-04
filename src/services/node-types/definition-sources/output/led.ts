import { LedElementState } from "@/elements";

import { createShapePathNode } from "../../components/ShapePathNode";
import { NodeDefinition } from "../../types";

function genCirclePath(cx: number, cy: number, r: number): string {
  return `M ${cx - r}, ${cy}
    a ${r},${r} 0 1,0 ${r * 2},0
    a ${r},${r} 0 1,0 ${-(r * 2)},0`;
}

const path = genCirclePath(25, 25, 20);

const ledNodeDefinition: NodeDefinition = {
  type: "output-led",
  elementProduction: "led",
  visual: {
    hitPath: path,
    component: createShapePathNode({
      path,
      stroke: "black",
      strokeWidth: 3,
      fill: (state: LedElementState) =>
        state.value ? "lightgreen" : "darkgreen",
    }),
  },
  pins: {
    IN: {
      direction: "input",
      x: 0,
      y: 25,
    },
  },
};
export default ledNodeDefinition;
