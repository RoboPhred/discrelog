import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { nodeIdsSelector } from "@/services/circuit-graph/selectors/nodes";

import Node from "./Node";

const NodesLayer: React.FC = () => {
  const nodeIds = useSelector((state) => nodeIdsSelector(state));

  const nodeElements = nodeIds.map((nodeId) => {
    return <Node key={nodeId} nodeId={nodeId} />;
  });

  return <g id="nodes-layer">{nodeElements}</g>;
};
export default NodesLayer;
