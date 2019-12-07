import * as React from "react";

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
export interface NodeVisualProps {
  x?: number;
  y?: number;
  nodeType: NodeType;
  nodeState: any;
  renderPin?(props: RenderPinProps): React.ReactElement<any>;
  onClick?(e: React.MouseEvent): void;
  onMouseDown?(e: React.MouseEvent): void;
  onMouseOver?(e: React.MouseEvent): void;
  onMouseUp?(e: React.MouseEvent): void;
  onMouseLeave?(e: React.MouseEvent): void;
}

type Props = NodeVisualProps;
class NodeVisual extends React.Component<Props> {
  render() {
    const {
      x = 0,
      y = 0,
      nodeType,
      nodeState,
      renderPin,
      onClick,
      onMouseDown,
      onMouseOver,
      onMouseUp,
      onMouseLeave
    } = this.props;

    const def = NodeTypes[nodeType];

    let body: React.ReactNode;
    if (!def) {
      body = <rect x={x} y={y} width={50} height={50} fill="red" />;
    }
    else {
      const { shapePath } = def.visual;
      const visuals = normalizeVisuals(shapePath, nodeState);
      body = visuals.map((v, i) => (
        <path
          key={i}
          d={v.path}
          fill={v.fill}
          stroke={v.stroke}
          strokeWidth={v.strokeWidth}
        />
      ));
    }

    const { hitPath } = def.visual;

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

    const transform = (x != 0 || y != 0) ? `translate(${x}, ${y})` : undefined;
    return (
      <g
        className="node-visual"
        transform={transform}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {hitPath && (
          <path d={hitPath} fill="transparent" onClick={onClick} />
        )}
        {body}
        {pins}
      </g>
    );
  }
}
export default NodeVisual;
