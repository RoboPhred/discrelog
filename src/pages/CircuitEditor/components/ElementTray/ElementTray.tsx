import * as React from "react";
import { useDispatch } from "react-redux";

import { typedKeys } from "@/utils";
import { NodeTypes, NodeType } from "@/node-defs";

import useMouseTracking from "@/hooks/useMouseTracking";

import { addNode } from "@/actions/node-add";
import { fieldDragStartNewNode } from "@/actions/field-drag-start-newnode";
import { fieldDragEnd } from "@/actions/field-drag-end";

import NodeVisual from "../NodeVisual";

import styles from "./ElementTray.module.css";

const ElementTray: React.FC = () => {
  const elements = typedKeys(NodeTypes).map((type) => {
    return <Element key={type} nodeType={type} />;
  });

  return (
    <div className={styles["circuittray"]}>
      <div className={styles["circuittray-title"]}>Elements</div>
      <div className={styles["circuittray-elements"]}>{elements}</div>
    </div>
  );
};
export default ElementTray;

interface ElementProps {
  nodeType: NodeType;
}
const Element: React.FC<ElementProps> = ({ nodeType }) => {
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

  return (
    <div onMouseDown={onMouseDown}>
      <svg width={110} height={70}>
        <NodeVisual nodeType={nodeType} nodeState={{}} />
      </svg>
    </div>
  );
};
