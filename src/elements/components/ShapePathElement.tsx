import * as React from "react";

import {
  ElementComponentProps,
  ElementComponentType,
  ElementVisualPath,
} from "../types";
import { normalizeVisuals } from "../utils";

export interface ShapePathElementProps extends ElementComponentProps {
  /**
   * The path or paths that make up the visual component of this node.
   */
  shapePath: ElementVisualPath | ElementVisualPath[];
}

const ShapePathElement: React.FC<ShapePathElementProps> = ({
  shapePath,
  isSelected,
  elementState,
}) => {
  const visuals = normalizeVisuals(shapePath, elementState);
  const body = visuals.map((v, i) => (
    <path
      key={i}
      d={v.path}
      // FIXME: If selected, this should use variable --color-element-selected
      fill={isSelected ? "goldenrod" : v.fill}
      stroke={isSelected ? "goldenrod" : v.stroke}
      strokeWidth={v.strokeWidth}
    />
  ));

  return <g>{body}</g>;
};

export function createShapePathElement(
  shapePath: ElementVisualPath | ElementVisualPath[]
): ElementComponentType {
  return (props: ElementComponentProps) => (
    <ShapePathElement shapePath={shapePath} {...props} />
  );
}
