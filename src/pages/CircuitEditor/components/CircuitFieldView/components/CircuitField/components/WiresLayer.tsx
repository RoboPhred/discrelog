import * as React from "react";
import { createStructuredSelector } from "reselect";

import { connect } from "react-redux";

import { AppState } from "@/store";

import { wireIdsSelector } from "@/services/graph/selectors/connections";

import Wire from "./Wire";

export interface WiresLayerProps {}

interface StateProps {
  wireIds: ReturnType<typeof wireIdsSelector>;
}
const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  wireIds: wireIdsSelector
});

type Props = WiresLayerProps & StateProps;
const WiresLayer: React.FC<Props> = ({ wireIds }) => {
  // FIXME: Use bound wire components to avoid creating new func instances for
  //  onWireMouseDown and onWireMouseUp.  See NodesLayer
  const connectorElements = wireIds.map(wireId => (
    <Wire key={wireId} wireId={wireId} />
  ));

  return <g id="wires-layer">{connectorElements}</g>;
};
export default connect(mapStateToProps)(WiresLayer);
