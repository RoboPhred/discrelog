import * as React from "react";
import { connect } from "react-redux";

import { typedKeys, cls } from "@/utils";
import sizing from "@/styles/sizing.module.css";
import flex from "@/styles/flex.module.css";

import { addNode } from "@/services/simulator/actions/node-add";
import { NodeTypes } from "@/services/simulator/node-types";

import NodeVisual from "../components/NodeVisual";

const mapDispatchToProps = {
  addNode
};
type DispatchProps = typeof mapDispatchToProps;

type Props = DispatchProps;

const CircuitTray: React.FC<Props> = ({ addNode }) => {
  const elements = typedKeys(NodeTypes).map(type => {
    return (
      <div key={type} onClick={() => addNode(type)}>
        <svg width={110} height={110}>
          <NodeVisual nodeType={type} nodeState={{}} />
        </svg>
      </div>
    );
  });

  return (
    <div className={cls(sizing["fill-parent"], flex["flex-column"])}>
      {elements}
    </div>
  );
};
export default connect(null, mapDispatchToProps)(CircuitTray);
