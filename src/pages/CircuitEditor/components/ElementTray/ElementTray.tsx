import * as React from "react";
import { connect } from "react-redux";

import { typedKeys } from "@/utils";
import { NodeTypes } from "@/node-defs";

import { addNode } from "@/services/simulator/actions/node-add";

import NodeVisual from "../NodeVisual";

import styles from "./ElementTray.module.css";

const mapDispatchToProps = {
  addNode
};
type DispatchProps = typeof mapDispatchToProps;

type Props = DispatchProps;

const ElementTray: React.FC<Props> = ({ addNode }) => {
  const elements = typedKeys(NodeTypes).map(type => {
    return (
      <div key={type} onClick={() => addNode(type)}>
        <svg width={110} height={70}>
          <NodeVisual nodeType={type} nodeState={{}} />
        </svg>
      </div>
    );
  });

  return (
    <div className={styles["circuittray"]}>
      <div className={styles["circuittray-title"]}>Elements</div>
      <div className={styles["circuittray-elements"]}>{elements}</div>
    </div>
  );
};
export default connect(null, mapDispatchToProps)(ElementTray);
