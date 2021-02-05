import * as React from "react";

import { PinDirection } from "@/logic";
import useSelector from "@/hooks/useSelector";
import { nodeDefinitionFromTypeSelector } from "@/services/node-types/selectors/node-types";

export interface NodeVisualProps {
  x?: number;
  y?: number;
  nodeType: string;
  nodeState: any;
  isSelected?: boolean;
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
  onClick,
  onMouseDown,
  onMouseOver,
  onMouseUp,
  onMouseLeave,
}) => {
  const def = useSelector((state) =>
    nodeDefinitionFromTypeSelector(state, nodeType)
  );

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
    </g>
  );
};

export default NodeVisual;
