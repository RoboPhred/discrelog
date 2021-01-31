import * as React from "react";

import {
  NodeComponentProps,
  NodeComponentType,
  NodeVisualPath,
} from "../types";
import { normalizeVisuals } from "../utils";

export interface ShapePathNodeProps extends NodeComponentProps {
  /**
   * The path or paths that make up the visual component of this node.
   */
  shapePath: NodeVisualPath | NodeVisualPath[];
}

const ShapePathNode: React.FC<ShapePathNodeProps> = ({
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

export function createShapePathNode(
  shapePath: NodeVisualPath | NodeVisualPath[]
): NodeComponentType {
  return (props: NodeComponentProps) => (
    <ShapePathNode shapePath={shapePath} {...props} />
  );
}
