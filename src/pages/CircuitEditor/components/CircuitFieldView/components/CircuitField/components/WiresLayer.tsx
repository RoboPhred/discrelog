import * as React from "react";
import { createStructuredSelector } from "reselect";

import { connect } from "react-redux";

import { AppState } from "@/store";

import { wireIdsSelector } from "@/services/graph/selectors/connections";

import Wire from "./Wire";

export interface WiresLayerProps {
  onWireMouseDown?(wireId: string, e: React.MouseEvent): void;
  onWireMouseUp?(wireId: string, e: React.MouseEvent): void;
}

interface StateProps {
  wireIds: ReturnType<typeof wireIdsSelector>;
}
const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  wireIds: wireIdsSelector
});

type Props = WiresLayerProps & StateProps;
const WiresLayer: React.FC<Props> = ({
  wireIds,
  onWireMouseDown,
  onWireMouseUp
}) => {
  // FIXME: Use bound wire components to avoid creating new func instances for
  //  onWireMouseDown and onWireMouseUp.  See NodesLayer
  const connectorElements = wireIds.map(wireId => (
    <Wire
      key={wireId}
      wireId={wireId}
      onMouseDown={e => onWireMouseDown && onWireMouseDown(wireId, e)}
      onMouseUp={e => onWireMouseUp && onWireMouseUp(wireId, e)}
    />
  ));

  return <g id="wires-layer">{connectorElements}</g>;
};
export default connect(mapStateToProps)(WiresLayer);
