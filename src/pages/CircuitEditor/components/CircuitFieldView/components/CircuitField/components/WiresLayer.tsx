import * as React from "react";

import { connectionIdsSelector } from "@/services/circuit-graph/selectors/connections";
import useSelector from "@/hooks/useSelector";

import Wire from "./Wire";

const WiresLayer: React.FC = () => {
  const connectionIds = useSelector(connectionIdsSelector);
  const connectorElements = connectionIds.map((connectionId) => (
    <Wire key={connectionId} connectionId={connectionId} />
  ));

  return <g id="wires-layer">{connectorElements}</g>;
};
export default WiresLayer;
