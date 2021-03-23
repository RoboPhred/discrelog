import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { wireIdsSelector } from "@/services/circuit-graph/selectors/wires";

import Wire from "./Wire";

const WiresLayer = React.memo(function WiresLayer() {
  const wireIds = useSelector(wireIdsSelector);

  const elements = wireIds.map((wireId) => (
    <Wire key={wireId} wireId={wireId} />
  ));

  return <g className="circuit-editor-wires-layer">{elements}</g>;
});

export default WiresLayer;
