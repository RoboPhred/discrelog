import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { nodeIdsFromCircuitIdSelector } from "@/services/circuits/selectors/nodes";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import NodePins from "./NodePins";

const NodePinsLayer: React.FC = React.memo(function NodePinsLayer() {
  const { circuitId } = useCircuitEditor();
  const nodeIds = useSelector((state) =>
    nodeIdsFromCircuitIdSelector(state, circuitId)
  );

  const elements = nodeIds.map((nodeId) => (
    <NodePins key={nodeId} nodeId={nodeId} />
  ));

  return <g>{elements}</g>;
});

export default NodePinsLayer;
