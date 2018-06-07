import * as React from "react";

import { ContainerConfig } from "konva";

import { Path, Group, Rect, KonvaNodeProps } from "react-konva";

import { NodePinDirection } from "@/services/simulator";
import {
  NodeType,
  NodeTypes,
  NodePinDefinition
} from "@/services/simulator/node-types";
import { normalizeVisuals } from "@/services/simulator/node-types/utils";

export interface RenderPinProps extends NodePinDefinition {
  id: string;
  direction: NodePinDirection;
}
export interface NodeVisualProps extends ContainerConfig, KonvaNodeProps {
  nodeType: NodeType;
  nodeState: any;
  renderPin?(props: RenderPinProps): React.ReactElement<any>;
  onClick?(e: KonvaMouseEvent): void;
}

type Props = NodeVisualProps;
class NodeVisual extends React.Component<Props> {
  render() {
    const {
      nodeType,
      nodeState,
      renderPin,
      onClick,
      ...konvaProps
    } = this.props;

    const def = NodeTypes[nodeType];
    if (!def) {
      return <Rect width={50} height={50} fill="red" />;
    }
    const { hitPath, shapePath } = def.visual;

    const visualOnClick = hitPath ? undefined : onClick;
    const visuals = normalizeVisuals(shapePath, nodeState);
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

    let pins: React.ReactNode = null;

    if (renderPin) {
      pins = Object.keys(def.pins).map(key => {
        const pin = def.pins[key];
        let element = renderPin({
          direction: pin.direction,
          id: key,
          ...pin
        });
        return React.cloneElement(element, { key: `input-${key}` });
      });
    }

    return (
      <Group {...konvaProps}>
        {hitPath && (
          <Path data={hitPath} fill="transparent" onClick={onClick} />
        )}
        {pathElements}
        {pins}
      </Group>
    );
  }
}
export default NodeVisual;
