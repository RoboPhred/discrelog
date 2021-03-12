import { NodeDefinition } from "../../types";

const toggleElementDefinition: NodeDefinition = {
  type: "interaction-momentary",
  category: "input-output",
  displayName: "Momentary Switch",
  elementProduction: "input-momentary",
  visual: {
    hitRect: {
      p1: { x: 5, y: 5 },
      p2: { x: 45, y: 45 },
    },
    component: "interaction-momentary",
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
