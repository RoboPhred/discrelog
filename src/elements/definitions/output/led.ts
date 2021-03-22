import { LedEvolverState } from "@/evolvers/definitions/output-led";

import { ElementDefinition } from "../../types";
import { createShapePathVisual } from "../../visuals/ShapePathElementVisual";

function genCirclePath(cx: number, cy: number, r: number): string {
  return `M ${cx - r}, ${cy}
    a ${r},${r} 0 1,0 ${r * 2},0
    a ${r},${r} 0 1,0 ${-(r * 2)},0`;
}

const path = genCirclePath(25, 25, 20);

const ledElementDefinition: ElementDefinition = {
  type: "output-led",
  category: "input-output",
  displayName: "Indicator Light",
  elementProduction: "output-led",
  visual: createShapePathVisual(path, {
    path,
    stroke: "black",
    strokeWidth: 3,
    fill: (state: LedEvolverState) =>
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
export default ledElementDefinition;
