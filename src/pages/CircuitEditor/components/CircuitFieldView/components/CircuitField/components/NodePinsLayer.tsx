import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { nodePinsSelector } from "@/services/graph/selectors/nodes";

import NodePin from "./NodePin";

const NodePinsLayer: React.FC = () => {
  const pins = useSelector((state) => nodePinsSelector(state));

  const elements = pins.map(({ nodeId, pinId }) => (
    <NodePin key={`${nodeId}-${pinId}`} nodeId={nodeId} pinId={pinId} />
  ));

  return <g id="node-pins-layer">{elements}</g>;
};

export default NodePinsLayer;
