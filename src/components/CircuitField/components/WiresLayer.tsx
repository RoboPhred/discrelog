import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { connectionIdsForEditingCircuitSelector } from "@/services/circuit-editor-view/selectors/nodes";

import Wire from "./Wire";

const WiresLayer: React.FC = () => {
  const connectionIds = useSelector(connectionIdsForEditingCircuitSelector);
  const connectorElements = connectionIds.map((connectionId) => (
    <Wire key={connectionId} connectionId={connectionId} />
  ));

  return <g id="wires-layer">{connectorElements}</g>;
};
export default WiresLayer;
