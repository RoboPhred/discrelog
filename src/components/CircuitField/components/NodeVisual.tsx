import * as React from "react";

import { cls } from "@/utils";

import useSelector from "@/hooks/useSelector";

import { nodeDefinitionFromTypeSelector } from "@/services/node-types/selectors/node-types";

// TODO: This component does a whole lot of nothing.  Remove it.

export interface NodeVisualProps {
  className?: string;
  circuitNodeId?: string;
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
  onContextMenu?(e: React.MouseEvent): void;
}

const NodeVisual: React.FC<NodeVisualProps> = ({
  className,
  circuitNodeId,
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
  onContextMenu,
}) => {
  const def = useSelector((state) =>
    nodeDefinitionFromTypeSelector(state, nodeType)
  );

  let body: React.ReactNode;
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
      <ElementComponent
        circuitNodeId={circuitNodeId}
        isSelected={isSelected}
        elementState={nodeState}
      />
    );
  }

  const transform = x != 0 || y != 0 ? `translate(${x}, ${y})` : undefined;
  return (
    <g
      className={cls(className, "node-visual", isSelected && "node-selected")}
      transform={transform}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onContextMenu={onContextMenu}
    >
      {body}
    </g>
  );
};

export default NodeVisual;
