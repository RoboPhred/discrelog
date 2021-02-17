import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { nodeDefFromNodeIdSelector } from "@/services/node-graph/selectors/node-def";

import NodePin from "./NodePin";

export interface NodePinsProps {
  nodeId: string;
}

const NodePins: React.FC<NodePinsProps> = ({ nodeId }) => {
  const def = useSelector((state) => nodeDefFromNodeIdSelector(state, nodeId));

  const pins = def?.pins ?? {};

  const elements = Object.keys(pins).map((pinId) => (
    <NodePin key={pinId} nodeId={nodeId} pinId={pinId} />
  ));

  return <>{elements}</>;
};

export default NodePins;
