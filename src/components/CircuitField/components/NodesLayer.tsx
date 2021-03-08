import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { nodeIdsFromCircuitIdSelector } from "@/services/circuits/selectors/nodes";

import { useCircuitField } from "../circuit-field-context";

import Node from "./Node";

const NodesLayer: React.FC = React.memo(function NodesLayer() {
  const { circuitId } = useCircuitField();
  const nodeIds = useSelector((state) =>
    nodeIdsFromCircuitIdSelector(state, circuitId)
  );

  const nodeElements = nodeIds.map((nodeId) => {
    return <Node key={nodeId} nodeId={nodeId} />;
  });

  return <g id="nodes-layer">{nodeElements}</g>;
});
export default NodesLayer;
