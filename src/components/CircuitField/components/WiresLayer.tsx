import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { connectionIdsByCircuitIdSelector } from "@/services/circuits/selectors/connections";

import { useCircuitField } from "../circuit-field-context";

import Wire from "./Wire";

const WiresLayer: React.FC = React.memo(function WiresLayer() {
  const { circuitId } = useCircuitField();
  const connectionIds = useSelector((state) =>
    connectionIdsByCircuitIdSelector(state, circuitId)
  );
  const connectorElements = connectionIds.map((connectionId) => (
    <Wire key={connectionId} connectionId={connectionId} />
  ));

  return <g id="wires-layer">{connectorElements}</g>;
});
export default WiresLayer;
