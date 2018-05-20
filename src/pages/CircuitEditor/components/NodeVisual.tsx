import * as React from "react";

import { Path, Group } from "react-konva";

import { NodeVisualDefinition, NodeVisualPath } from "@/services/simulator/node-types";

export interface NodeVisualProps {
  visual: NodeVisualDefinition;
  state: any;
  onClick?(): void;
}

type Props = NodeVisualProps;
class NodeVisual extends React.Component<Props> {
  render() {
    const {
      visual: {
        hitPath,
        shapePath
      },
      state,
      onClick
    } = this.props;

    const visualOnClick = hitPath ? undefined : onClick;
    const visuals = normalizeVisuals(shapePath, state);
    const pathElements = visuals.map((v, i) => (
      <Path
        key={i}
        data={v.path}
        fill={v.fill}
        stroke={v.stroke}
        strokeWidth={v.strokeWidth}
        onClick={visualOnClick}
      />
    ));

    return (
      <Group>
        {hitPath && (
          <Path
            data={hitPath}
            fill="transparent"
            onClick={onClick}
          />
        )}
        {pathElements}
      </Group>
    );
  }
}
export default NodeVisual;

function normalizeVisuals(v: NodeVisualPath | NodeVisualPath[], state: any): { path: string; fill?: string; stroke?: string; strokeWidth?: number }[] {
  const asArray = Array.isArray(v) ? v : [v];

  return asArray.map(x => {
    if (typeof x === "string") {
      return {
        path: x,
        fill: "black",
        stroke: "black",
        strokeWidth: 2
      };
    }
    const fill = typeof x.fill === "function" ? x.fill(state || {}) : x.fill;
    const stroke = typeof x.stroke === "function" ? x.stroke(state || {}) : x.stroke;
    const strokeWidth = typeof x.strokeWidth === "function" ? x.strokeWidth(state || {}) : x.strokeWidth;
    return {
      path: x.path,
      fill,
      stroke,
      strokeWidth
    };
  })
}
