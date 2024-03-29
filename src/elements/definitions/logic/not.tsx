import * as React from "react";

import { Rectangle } from "@/geometry";

import { ElementDefinition } from "../../types";
import { createStaticElementVisual } from "../../visuals/static-element-visual";

// Shape path from https://commons.wikimedia.org/wiki/File:NOT_ANSI.svg

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

const notElementDefinition: ElementDefinition = {
  type: "logic-not",
  category: "logic",
  displayName: "NOT",
  elementProduction: "logic-not",
  visual: createStaticElementVisual(
    hitRect,
    <g>
      <path
        fill="transparent"
        stroke="none"
        d="M28.96875 2.59375v44.8125l2.15625-1.0625 41.03125-20v-2.6875l-41.03125-20-2.15625-1.0625z"
      />
      <path
        className="element-select-highlight--stroke"
        fill="none"
        stroke="#000"
        strokeWidth="2"
        d="M79,25 H100 M29,25 h-24"
      />
      <path
        className="element-select-highlight--fill"
        d="M28.96875 2.59375v44.8125l2.15625-1.0625 41.03125-20v-2.6875l-41.03125-20-2.15625-1.0625zm3 4.8125L68.09375 25l-36.125 17.59375V7.40625z"
      />
      <path
        className="element-select-highlight--stroke"
        fill="none"
        stroke="#000"
        strokeWidth="2"
        d="M79 25a4 4 0 1 1-8 0 4 4 0 1 1 8 0z"
      />
    </g>
  ),
  pins: {
    IN: {
      direction: "input",
      x: 0,
      y: 25,
    },
    OUT: {
      direction: "output",
      x: 100,
      y: 25,
    },
  },
};
export default notElementDefinition;
