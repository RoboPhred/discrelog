import * as React from "react";

import { ContainerConfig } from "konva";

import {
  Path,
  Group,
  Rect,
  KonvaNodeComponent,
  KonvaNodeProps
} from "react-konva";

import {
  NodeVisualDefinition,
  NodeVisualPath,
  NodeType,
  NodeTypes,
  NodePinDefinition
} from "@/services/simulator/node-types";
import { normalizeVisuals } from "@/services/simulator/node-types/utils";
import { NodePinDirection } from "@/services/simulator/types";

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

    const inputs = def.inputs || [];
    const outputs = def.outputs || [];

    let inputPins: React.ReactNode = null;
    let outputPins: React.ReactNode = null;

    if (renderPin) {
      inputPins = Object.keys(inputs).map(key => {
        const input = inputs[key];
        let element = renderPin({
          direction: "input",
          id: key,
          ...input
        });
        return React.cloneElement(element, { key: `input-${key}` });
      });

      outputPins = Object.keys(outputs).map(key => {
        const output = outputs[key];
        let element = renderPin({
          direction: "output",
          id: key,
          ...output
        });
        return React.cloneElement(element, { key: `output-${key}` });
      });
    }

    return (
      <Group {...konvaProps}>
        {hitPath && (
          <Path data={hitPath} fill="transparent" onClick={onClick} />
        )}
        {pathElements}
        {inputPins}
        {outputPins}
      </Group>
    );
  }
}
export default NodeVisual;
