import * as React from "react";

import { connect } from "react-redux";

import { wireIdsSelector } from "@/services/graph/selectors/wires";
import useSelector from "@/hooks/useSelector";

import Wire from "./Wire";

const WiresLayer: React.FC = () => {
  const wireIds = useSelector(wireIdsSelector);
  const connectorElements = wireIds.map(wireId => (
    <Wire key={wireId} wireId={wireId} />
  ));

  return <g id="wires-layer">{connectorElements}</g>;
};
export default WiresLayer;
