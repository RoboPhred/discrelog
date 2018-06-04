import * as React from "react";

import { connect } from "react-redux";

import { Stage, Layer } from "react-konva";

import { addNode } from "@/services/simulator/actions";
import { NodeTypes } from "@/services/simulator/node-types";

import { typedKeys } from "@/utils";

import NodeVisual from "../components/NodeVisual";

const mapDispatchToProps = {
  addNode
};
type DispatchProps = typeof mapDispatchToProps;

type Props = DispatchProps;
class CircuitTray extends React.Component<Props> {
  render() {
    const { addNode } = this.props;

    const elements = typedKeys(NodeTypes).map(type => {
      return (
        <div key={type} onClick={() => addNode(type)}>
          <Stage width={110} height={110}>
            <Layer>
              <NodeVisual nodeType={type} nodeState={{}} />
            </Layer>
          </Stage>
        </div>
      );
    });

    // TODO: styled component?
    const style: React.CSSProperties = {
      display: "flex",
      flexDirection: "column"
    };
    return <div style={style}>{elements}</div>;
  }
}
export default connect(null, mapDispatchToProps)(CircuitTray);
