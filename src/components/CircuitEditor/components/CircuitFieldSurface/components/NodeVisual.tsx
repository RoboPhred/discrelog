import * as React from "react";

import { cls } from "@/utils";

import useSelector from "@/hooks/useSelector";

import { nodeDefinitionFromTypeSelector } from "@/services/node-types/selectors/node-types";
import { getNodeVisualElement } from "@/nodes/visuals";

export interface NodeVisualProps {
  className?: string;
  circuitNodeId?: string;
  x?: number;
  y?: number;
  nodeType: string;
}

const EmptyState = Object.freeze({});

const NodeVisual: React.FC<NodeVisualProps> = React.memo(function NodeVisual({
  className,
  circuitNodeId,
  x = 0,
  y = 0,
  nodeType,
}) {
  const def = useSelector((state) =>
    nodeDefinitionFromTypeSelector(state, nodeType)
  );

  let body: React.ReactNode;
  if (!def) {
    body = <rect x={x} y={y} width={50} height={50} fill="red" />;
  } else {
    body = getNodeVisualElement(circuitNodeId, [], EmptyState, def.visual);
  }

  const transform = x != 0 || y != 0 ? `translate(${x}, ${y})` : undefined;
  return (
    <g className={cls(className, "node-visual")} transform={transform}>
      {body}
    </g>
  );
});

export default NodeVisual;
