import * as React from "react";
import { createStructuredSelector } from "reselect";

import { connect } from "react-redux";

import { AppState } from "@/store";
import { Connection } from "@/types";

import { connectionsSelector } from "@/services/simulator/selectors/connections";

import Wire from "./Wire";

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

    return <g id="wires-layer">{connectorElements}</g>;
  }
}
export default connect(mapStateToProps)(WiresLayer);

function connectionKey(connection: Connection): string {
  const { outputPin, inputPin } = connection;
  return `${outputPin.nodeId}:${outputPin.pinId}-${inputPin.nodeId}:${inputPin.pinId}`;
}
