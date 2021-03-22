import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { connectionIdsForCircuitIdSelector } from "@/services/circuit-graph/selectors/connections";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import Wire from "./Wire";

const WiresLayer: React.FC = React.memo(function WiresLayer() {
  const { circuitId } = useCircuitEditor();
  const connectionIds = useSelector((state) =>
    connectionIdsForCircuitIdSelector(state, circuitId)
  );
  const connectorElements = connectionIds.map((connectionId) => (
    <Wire key={connectionId} connectionId={connectionId} />
  ));

  return <g>{connectorElements}</g>;
});
export default WiresLayer;
