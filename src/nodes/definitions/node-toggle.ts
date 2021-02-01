import { ToggleElementState } from "@/elements";

import { createShapePathNode } from "../components/ShapePathNode";
import { NodeDefinition } from "../types";

const toggleElementDefinition: NodeDefinition = {
  type: "toggle",
  elementProduction: "toggle",
  visual: {
    hitPath: `M5,5 L45,5 L45,45 L5,45 z`,
    component: createShapePathNode([
      {
        path: "M5,5 L45,5 L45,45 L5,45 z",
        fill: "#AFAFAF",
        stroke: "black",
      },
      {
        path: "M10,10 L40,10 L40,40 L10,40 z",
        fill: (state: ToggleElementState) =>
          state.toggleState ? "lightgreen" : "darkgreen",
        stroke: "black",
      },
    ]),
  },
  pins: {
    OUT: {
      direction: "output",
      x: 45,
      y: 25,
    },
  },
};
export default toggleElementDefinition;
