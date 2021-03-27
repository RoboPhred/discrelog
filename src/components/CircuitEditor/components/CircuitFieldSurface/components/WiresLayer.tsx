import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { wireIdsFromCircuitIdSelector } from "@/services/circuit-graph/selectors/wires";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import Wire from "./Wire";

const WiresLayer = React.memo(function WiresLayer() {
  const { circuitId } = useCircuitEditor();
  const wireIds = useSelector((state) =>
    wireIdsFromCircuitIdSelector(state, circuitId)
  );

  const elements = wireIds.map((wireId) => (
    <Wire key={wireId} wireId={wireId} />
  ));

  return <g className="circuit-editor-wires-layer">{elements}</g>;
});

export default WiresLayer;
