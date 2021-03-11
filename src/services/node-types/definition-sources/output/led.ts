import { LedElementState } from "@/elements/definitions/output-led";

import { createShapePathVisual } from "../../components/ShapePathNode";

import { NodeDefinition } from "../../types";

function genCirclePath(cx: number, cy: number, r: number): string {
  return `M ${cx - r}, ${cy}
    a ${r},${r} 0 1,0 ${r * 2},0
    a ${r},${r} 0 1,0 ${-(r * 2)},0`;
}

const path = genCirclePath(25, 25, 20);

const ledNodeDefinition: NodeDefinition = {
  type: "output-led",
  category: "input-output",
  displayName: "Indicator Light",
  elementProduction: "output-led",
  visual: createShapePathVisual(path, {
    path,
    stroke: "black",
    strokeWidth: 3,
    fill: (state: LedElementState) =>
      state.value ? "lightgreen" : "darkgreen",
  }),
  pins: {
    IN: {
      direction: "input",
      x: 0,
      y: 25,
    },
  },
};
export default ledNodeDefinition;
