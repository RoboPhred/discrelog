import * as React from "react";
import { useDispatch } from "react-redux";
import getBounds from "svg-path-bounds";

import { boundsToRect, Rectangle } from "@/geometry";

import { interactElement } from "@/actions/element-interact";

import { ElementComponentProps, ElementVisualDefinition } from "../types";

export interface ShapePathDefinition {
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

export type ShapePath = string | ShapePathDefinition;

interface ShapePathElementVisualProps {
  /**
   * The path or paths that make up the visual component of this element.
   */
  shapePath: ShapePath | ShapePath[];
  hitPath: string;
}

const ShapePathElementVisual: React.FC<
  ShapePathElementVisualProps & ElementComponentProps
> = ({ elementId, elementPath, shapePath, hitPath, evolverState }) => {
  const dispatch = useDispatch();

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!elementId) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      dispatch(interactElement([...(elementPath || []), elementId]));
    },
    [elementId, dispatch, elementPath]
  );

  const visuals = normalizeVisuals(shapePath, evolverState);
  const body = visuals.map((v, i) => (
    <path
      key={i}
      d={v.path}
      className="element-select-highlight--stroke element-select-highlight--fill"
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

interface ShapePathElementTrayItemProps {
  shapePath: ShapePath | ShapePath[];
  hitRect: Rectangle;
}
const TrayShapePadding = 5;
const ShapePathElementTrayItem: React.FC<ShapePathElementTrayItemProps> = ({
  shapePath,
  hitRect,
}) => {
  const visuals = normalizeVisuals(shapePath, {});
  const body = visuals.map((v, i) => (
    <path
      key={i}
      d={v.path}
      className="element-select-highlight--stroke element-select-highlight--fill"
      fill={v.fill}
      stroke={v.stroke}
      strokeWidth={v.strokeWidth}
    />
  ));

  return (
    <svg
      width={50}
      height={50}
      viewBox={`${hitRect.p1.x - TrayShapePadding} ${
        hitRect.p1.y - TrayShapePadding
      } ${hitRect.p2.x - hitRect.p1.x + TrayShapePadding * 2} ${
        hitRect.p2.y - hitRect.p1.y + TrayShapePadding * 2
      }`}
    >
      {body}
    </svg>
  );
};

export function createShapePathVisual(
  hitPath: string,
  shapePath: ShapePath | ShapePath[]
): ElementVisualDefinition {
  const hitRect = boundsToRect(getBounds(hitPath));
  return {
    trayComponent: () => (
      <ShapePathElementTrayItem shapePath={shapePath} hitRect={hitRect} />
    ),
    component: (props: ElementComponentProps) => (
      <ShapePathElementVisual
        shapePath={shapePath}
        hitPath={hitPath}
        {...props}
      />
    ),
    hitRect,
  };
}

function normalizeVisuals(
  v: ShapePath | ShapePath[],
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
