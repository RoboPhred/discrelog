import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { nodeIdsFromCircuitIdSelector } from "@/services/circuits/selectors/nodes";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import Node from "./Node";

const NodesLayer: React.FC = React.memo(function NodesLayer() {
  const { circuitId } = useCircuitEditor();
  const nodeIds = useSelector((state) =>
    nodeIdsFromCircuitIdSelector(state, circuitId)
  );

  const nodeElements = nodeIds.map((nodeId) => {
    return <Node key={nodeId} nodeId={nodeId} />;
  });

  return <g>{nodeElements}</g>;
});
export default NodesLayer;
