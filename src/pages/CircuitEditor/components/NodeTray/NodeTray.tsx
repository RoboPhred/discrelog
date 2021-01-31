import * as React from "react";
import { useDispatch } from "react-redux";

import { typedKeys } from "@/utils";
import {
  NodeComponentType,
  NodeDefinitionsByType,
  NodeType,
  LargestNodeSize,
} from "@/nodes";

import useMouseTracking from "@/hooks/useMouseTracking";

import { addNode } from "@/actions/element-add";
import { fieldDragStartNewNode } from "@/actions/field-drag-start-newnode";
import { fieldDragEnd } from "@/actions/field-drag-end";

import styles from "./NodeTray.module.css";

const NodeTray: React.FC = () => {
  const nodes = typedKeys(NodeDefinitionsByType).map((type) => {
    return <TrayNode key={type} nodeType={type} />;
  });

  return (
    <div className={styles["circuittray"]}>
      <div className={styles["circuittray-elements"]}>{nodes}</div>
    </div>
  );
};
export default NodeTray;

interface TrayNodeProps {
  nodeType: NodeType;
}
const TrayNode: React.FC<TrayNodeProps> = ({ nodeType }) => {
  const dispatch = useDispatch();
  const onClick = React.useCallback(
    (e: MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      dispatch(addNode(nodeType));
    },
    [nodeType]
  );

  const onDragStart = React.useCallback(() => {
    dispatch(fieldDragStartNewNode(nodeType));
  }, [nodeType]);

  const onDragEnd = React.useCallback(() => {
    // We do not know the point from here, and selection mode is irrelevant.
    dispatch(fieldDragEnd({ x: -1, y: -1 }, "set"));
  }, []);

  const { startTracking } = useMouseTracking({
    onClick,
    onDragStart,
    onDragEnd,
  });

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    startTracking(e);
  }, []);

  const def = NodeDefinitionsByType[nodeType];
  let NodeComponent: NodeComponentType;
  if (def) {
    NodeComponent = def.visual.component;
  } else {
    NodeComponent = () => <rect fill="red" x1={0} y1={0} x2={50} y2={50} />;
  }

  return (
    <div onMouseDown={onMouseDown}>
      <svg width={LargestNodeSize.width} height={LargestNodeSize.height}>
        <NodeComponent elementState={{}} />
      </svg>
    </div>
  );
};
