import * as React from "react";

import { PinDirection } from "@/elements";

import { NodeType, NodeDefinitionsByType } from "@/nodes";

export interface RenderPinProps {
  id: string;
  direction: PinDirection;
  x: number;
  y: number;
}
export interface NodeVisualProps {
  x?: number;
  y?: number;
  nodeType: NodeType;
  nodeState: any;
  isSelected?: boolean;
  renderPin?(props: RenderPinProps): React.ReactElement<any>;
  onClick?(e: React.MouseEvent): void;
  onMouseDown?(e: React.MouseEvent): void;
  onMouseOver?(e: React.MouseEvent): void;
  onMouseUp?(e: React.MouseEvent): void;
  onMouseLeave?(e: React.MouseEvent): void;
}

const NodeVisual: React.FC<NodeVisualProps> = ({
  x = 0,
  y = 0,
  nodeType,
  nodeState,
  isSelected = false,
  renderPin,
  onClick,
  onMouseDown,
  onMouseOver,
  onMouseUp,
  onMouseLeave,
}) => {
  const def = NodeDefinitionsByType[nodeType];

  let body: React.ReactNode;
  let hitPath: string | undefined;
  let pins: React.ReactNode = null;
  if (!def) {
    body = (
      <rect
        x={x}
        y={y}
        width={50}
        height={50}
        fill={isSelected ? "goldenrod" : "red"}
      />
    );
  } else {
    const { component: ElementComponent } = def.visual;
    body = (
      <ElementComponent isSelected={isSelected} elementState={nodeState} />
    );
    hitPath = def.visual.hitPath;

    if (renderPin) {
      pins = Object.keys(def.pins).map((key) => {
        const pin = def.pins[key];
        let element = renderPin({
          id: key,
          ...pin,
          ...def.pins[key],
        });
        return React.cloneElement(element, { key: `input-${key}` });
      });
    }
  }

  const transform = x != 0 || y != 0 ? `translate(${x}, ${y})` : undefined;
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
      {hitPath && <path d={hitPath} fill="transparent" onClick={onClick} />}
      {body}
      {pins}
    </g>
  );
};

export default NodeVisual;
