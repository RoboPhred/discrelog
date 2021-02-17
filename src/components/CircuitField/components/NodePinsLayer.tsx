import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { nodeIdsForEditingCircuitSelector } from "@/services/circuit-editor-ui/selectors/nodes";

import NodePins from "./NodePins";

const NodePinsLayer: React.FC = () => {
  const nodeIds = useSelector(nodeIdsForEditingCircuitSelector);

  const elements = nodeIds.map((nodeId) => (
    <NodePins key={nodeId} nodeId={nodeId} />
  ));

  return <g id="node-pins-layer">{elements}</g>;
};

export default NodePinsLayer;
