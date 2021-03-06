import { ToggleElementState } from "@/elements";

import { createShapePathVisual } from "../../components/ShapePathNode";
import { NodeDefinition } from "../../types";

const toggleElementDefinition: NodeDefinition = {
  type: "interaction-toggle",
  category: "i/o",
  displayName: "Toggle Switch",
  elementProduction: "toggle",
  visual: createShapePathVisual(`M5,5 L45,5 L45,45 L5,45 z`, [
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
  pins: {
    OUT: {
      direction: "output",
      x: 45,
      y: 25,
    },
  },
};
export default toggleElementDefinition;
