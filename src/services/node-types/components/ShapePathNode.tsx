import * as React from "react";

import { NodeComponentProps, NodeComponentType } from "../types";

export interface NodeVisualPathDefinition {
  /**
   * The svg path of this visual element.
   */
  path: string;
  /**
   * The fill or fill-producing function for this visual element.
   */
  fill?: string | ((state: any) => string);
  stroke?: string | ((state: any) => string);
  strokeWidth?: number | ((state: any) => number);
}

export type NodeVisualPath = string | NodeVisualPathDefinition;

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

export function normalizeVisuals(
  v: NodeVisualPath | NodeVisualPath[],
  state: any
): { path: string; fill?: string; stroke?: string; strokeWidth?: number }[] {
  const asArray = Array.isArray(v) ? v : [v];

  return asArray.map((x) => {
    if (typeof x === "string") {
      return {
        path: x,
        fill: "black",
        stroke: "black",
        strokeWidth: 2,
      };
    }
    const fill = typeof x.fill === "function" ? x.fill(state || {}) : x.fill;
    const stroke =
      typeof x.stroke === "function" ? x.stroke(state || {}) : x.stroke;
    const strokeWidth =
      typeof x.strokeWidth === "function"
        ? x.strokeWidth(state || {})
        : x.strokeWidth;
    return {
      path: x.path,
      fill,
      stroke,
      strokeWidth,
    };
  });
}
