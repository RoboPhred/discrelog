import * as React from "react";
import { createStructuredSelector } from "reselect";

import { connect } from "react-redux";

import { Layer } from "react-konva";

import { AppState } from "@/store";
import { connectionsSelector } from "@/services/simulator/selectors";

import Wire from "./Wire";
import { Connection } from "@/services/simulator";

interface StateProps {
  connections: ReturnType<typeof connectionsSelector>;
}
const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  connections: connectionsSelector
});

type Props = StateProps;
class WiresLayer extends React.Component<Props> {
  render() {
    const { connections } = this.props;

    const connectorElements = connections.map(connection => (
      <Wire
        key={connectionKey(connection)}
        output={connection.outputPin}
        input={connection.inputPin}
      />
    ));

    return <Layer>{connectorElements}</Layer>;
  }
}
export default connect(mapStateToProps)(WiresLayer);

function connectionKey(connection: Connection): string {
  const { outputPin, inputPin } = connection;
  return `${outputPin.nodeId}:${outputPin.pin}-${inputPin.nodeId}:${inputPin.pin}`;
}
