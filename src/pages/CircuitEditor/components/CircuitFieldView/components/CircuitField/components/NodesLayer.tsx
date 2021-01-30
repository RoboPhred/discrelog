import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { nodeIdsForEditingCircuitSelector } from "@/services/circuit-editor-ui/selectors/nodes";

import Node from "./Node";

const NodesLayer: React.FC = () => {
  const nodeIds = useSelector(nodeIdsForEditingCircuitSelector);

  const nodeElements = nodeIds.map((nodeId) => {
    return <Node key={nodeId} nodeId={nodeId} />;
  });

  return <g id="nodes-layer">{nodeElements}</g>;
};
export default NodesLayer;
