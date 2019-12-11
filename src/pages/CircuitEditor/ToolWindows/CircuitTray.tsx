import * as React from "react";
import { createUseStyles } from "react-jss";
import { connect } from "react-redux";

import { addNode } from "@/services/simulator/actions/node-add";
import { NodeTypes } from "@/services/simulator/node-types";

import { typedKeys } from "@/utils";

import NodeVisual from "../components/NodeVisual";

const mapDispatchToProps = {
  addNode
};
type DispatchProps = typeof mapDispatchToProps;

type Props = DispatchProps;

const useStyles = createUseStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  }
});

const CircuitTray: React.FC<Props> = ({ addNode }) => {
  const styles = useStyles();

  const elements = typedKeys(NodeTypes).map(type => {
    return (
      <div key={type} onClick={() => addNode(type)}>
        <svg width={110} height={110}>
          <NodeVisual nodeType={type} nodeState={{}} />
        </svg>
      </div>
    );
  });

  return <div className={styles.root}>{elements}</div>;
}
export default connect(null, mapDispatchToProps)(CircuitTray);
