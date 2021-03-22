import { ElementDefinition } from "../../types";

const toggleElementDefinition: ElementDefinition = {
  type: "interaction-toggle",
  category: "input-output",
  displayName: "Toggle Switch",
  elementProduction: "input-toggle",
  visual: {
    hitRect: {
      p1: { x: 5, y: 5 },
      p2: { x: 45, y: 45 },
    },
    component: "interaction-toggle",
  },
  pins: {
    OUT: {
      direction: "output",
      x: 50,
      y: 25,
    },
  },
};

export default toggleElementDefinition;
