import * as React from "react";

import useSelector from "@/hooks/useSelector";
import { nodePositionsByIdSelector } from "@/services/field/selectors/positions";

import CircuitNode from "./CircuitNode";

const NodesLayer: React.FC = () => {
  const nodePositionsById = useSelector(nodePositionsByIdSelector);

  const nodeElements = Object.keys(nodePositionsById).map(nodeId => {
    const { x, y } = nodePositionsById[nodeId];
    return <CircuitNode key={nodeId} nodeId={nodeId} x={x} y={y} />;
  });

  return <g id="nodes-layer">{nodeElements}</g>;
};
export default NodesLayer;
