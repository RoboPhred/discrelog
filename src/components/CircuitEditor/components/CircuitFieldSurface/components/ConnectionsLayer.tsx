import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { connectionIdsForCircuitIdSelector } from "@/services/circuit-graph/selectors/connections";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import ElementConnection from "./ElementConnection";

const ConnectionsLayer: React.FC = React.memo(function ConnectionsLayer() {
  const { circuitId } = useCircuitEditor();
  const connectionIds = useSelector((state) =>
    connectionIdsForCircuitIdSelector(state, circuitId)
  );
  const connectorElements = connectionIds.map((connectionId) => (
    <ElementConnection key={connectionId} connectionId={connectionId} />
  ));

  return <g>{connectorElements}</g>;
});
export default ConnectionsLayer;
