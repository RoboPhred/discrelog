import * as React from "react";
import getBounds from "svg-path-bounds";

import { boundsToRect } from "@/geometry";

import { ElementDefinition } from "../../types";
import { createStaticElementVisual } from "../../visuals/static-element-visual";

// Shape path from https://commons.wikimedia.org/wiki/File:Buffer_ANSI.svg

const hitPath = `M 28.96875,2.59375 L 28.96875,5 L 28.96875,45 L 28.96875,47.40625 L 31.125,46.34375 L 72.15625,26.34375 L 75,25 L 72.15625,23.65625 L 31.125,3.65625 L 28.96875,2.59375 z`;

const bufferElementDefinition: ElementDefinition = {
  type: "logic-buffer",
  category: "logic",
  displayName: "Buffer",
  elementProduction: "logic-buffer",
  visual: createStaticElementVisual(
    boundsToRect(getBounds(hitPath)),
    <g>
      <path d={hitPath} fill="transparent" stroke="none" />
      <path
        className="element-select-highlight--stroke"
        fill="none"
        stroke="black"
        strokeWidth="2"
        d="M72,25 L 100,25"
      />
      <path
        className="element-select-highlight--stroke"
        fill="none"
        stroke="black"
        strokeWidth="2"
        d="M 29.043478,25 L 5.0434781,25"
      />
      <path
        className="element-select-highlight--fill"
        stroke="none"
        fill="black"
        d="M 28.96875,2.59375 L 28.96875,5 L 28.96875,45 L 28.96875,47.40625 L 31.125,46.34375 L 72.15625,26.34375 L 75,25 L 72.15625,23.65625 L 31.125,3.65625 L 28.96875,2.59375 z M 31.96875,7.40625 L 68.09375,25 L 31.96875,42.59375 L 31.96875,7.40625 z"
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
export default bufferElementDefinition;
