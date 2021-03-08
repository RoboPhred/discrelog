import * as React from "react";
import { useDispatch } from "react-redux";
import getBounds from "svg-path-bounds";

import { boundsToRect } from "@/geometry";

import { interactNode } from "@/actions/node-interact";

import { NodeComponentProps, NodeVisualDefinition } from "../types";

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
  hitPath: string;
}

const ShapePathNode: React.FC<ShapePathNodeProps> = ({
  circuitNodeId,
  circuitNodePath,
  shapePath,
  hitPath,
  elementState,
}) => {
  const dispatch = useDispatch();

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!circuitNodeId) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      dispatch(interactNode([...(circuitNodePath || []), circuitNodeId]));
    },
    [circuitNodeId, dispatch, circuitNodePath]
  );

  const visuals = normalizeVisuals(shapePath, elementState);
  const body = visuals.map((v, i) => (
    <path
      key={i}
      d={v.path}
      className="node-select-highlight--stroke node-select-highlight--fill"
      fill={v.fill}
      stroke={v.stroke}
      strokeWidth={v.strokeWidth}
    />
  ));

  return (
    <g onClick={onClick}>
      <path d={hitPath} fill="transparent" stroke="none" />
      {body}
    </g>
  );
};

export function createShapePathVisual(
  hitPath: string,
  shapePath: NodeVisualPath | NodeVisualPath[]
): NodeVisualDefinition {
  return {
    component: (props: NodeComponentProps) => (
      <ShapePathNode shapePath={shapePath} hitPath={hitPath} {...props} />
    ),
    hitRect: boundsToRect(getBounds(hitPath)),
  };
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
