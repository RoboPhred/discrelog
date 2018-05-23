import * as React from "react";

import { Path, Group } from "react-konva";

import {
  NodeVisualDefinition,
  NodeVisualPath
} from "@/services/simulator/node-types";
import { normalizeVisuals } from "@/services/simulator/node-types/utils";

export interface NodeVisualProps {
  visual: NodeVisualDefinition;
  state: any;
  onClick?(e: KonvaMouseEvent): void;
}

type Props = NodeVisualProps;
class NodeVisual extends React.Component<Props> {
  render() {
    const {
      visual: { hitPath, shapePath },
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
          <Path data={hitPath} fill="transparent" onClick={onClick} />
        )}
        {pathElements}
      </Group>
    );
  }
}
export default NodeVisual;
