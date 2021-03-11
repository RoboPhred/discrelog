import * as React from "react";

import { Rectangle } from "@/geometry";

import { NodeDefinition } from "../../types";
import { createStaticNodeVisual } from "../../visuals/static-node-visual";

// Shape path from https://en.wikipedia.org/wiki/NAND_logic#/media/File:NAND_ANSI_Labelled.svg

const hitRect: Rectangle = {
  p1: {
    x: 24,
    y: 5,
  },
  p2: {
    x: 80,
    y: 45,
  },
};

const nandNodeDefinition: NodeDefinition = {
  type: "logic-nand",
  category: "logic",
  displayName: "NAND",
  elementProduction: "logic-nand",
  visual: createStaticNodeVisual(
    hitRect,
    <g transform="translate(-10,0)">
      <path
        className="node-select-highlight--stroke"
        strokeWidth="2"
        stroke="black"
        fill="none"
        d="M 88.11111,25 C 101.62222,25 105,25 105,25"
      />
      <path
        className="node-select-highlight--stroke"
        strokeWidth="2"
        stroke="black"
        fill="none"
        d="M 41,15 L 15,15"
      />
      <path
        className="node-select-highlight--stroke"
        strokeWidth="2"
        stroke="black"
        fill="none"
        d="M 42,35 L 15,35"
      />
      <path
        className="node-select-highlight--fill"
        d="M 40,5 L 40,6.4285714 L 40,43.571429 L 40,45 L 41.428571,45 L 60.47619,45 C 71.744098,45 80.47619,35.999955 80.47619,25 C 80.47619,14.000045 71.744099,5.0000002 60.47619,5 C 60.47619,5 60.47619,5 41.428571,5 L 40,5 z M 42.857143,7.8571429 C 50.834264,7.8571429 55.918368,7.8571429 58.095238,7.8571429 C 59.285714,7.8571429 59.880952,7.8571429 60.178571,7.8571429 C 60.327381,7.8571429 60.409227,7.8571429 60.446429,7.8571429 C 60.465029,7.8571429 60.471543,7.8571429 60.47619,7.8571429 C 70.236853,7.857143 77.142857,15.497098 77.142857,25 C 77.142857,34.502902 69.760662,42.142857 60,42.142857 L 42.857143,42.142857 L 42.857143,7.8571429 z"
      />
      <path
        className="node-select-highlight--stroke"
        strokeWidth="2"
        stroke="black"
        fill="none"
        d="M 79,25 A 4,4 0 1 1 71,25 A 4,4 0 1 1 79,25 z"
        transform="translate(9,0)"
      />
    </g>
  ),
  pins: {
    A: {
      direction: "input",
      x: 0,
      y: 14.5,
    },
    B: {
      direction: "input",
      x: 0,
      y: 35,
    },
    OUT: {
      direction: "output",
      x: 100,
      y: 25,
    },
  },
};
export default nandNodeDefinition;
