import * as React from "react";
import { useDispatch } from "react-redux";

import { typedKeys } from "@/utils";

import useMouseTracking from "@/hooks/useMouseTracking";

import {
  nodeDefinitionFromTypeSelector,
  nodeDefinitionsSelector,
} from "@/services/node-types/selectors/node-types";
import { NodeComponentType } from "@/services/node-types/types/visual";

import { addNode } from "@/actions/node-add";
import { fieldDragStartNewNode } from "@/actions/field-drag-start-newnode";
import { fieldDragEnd } from "@/actions/field-drag-end";

import styles from "./NodeTray.module.css";
import useSelector from "@/hooks/useSelector";

const NodeTray: React.FC = () => {
  const nodeDefinitions = useSelector(nodeDefinitionsSelector);
  const nodes = nodeDefinitions.map((def) => {
    return <TrayNode key={def.type} nodeType={def.type} />;
  });

  return (
    <div className={styles["nodetray"]}>
      <div className={styles["nodetray-elements"]}>{nodes}</div>
    </div>
  );
};
export default NodeTray;

interface TrayNodeProps {
  nodeType: string;
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

  const def = useSelector((state) =>
    nodeDefinitionFromTypeSelector(state, nodeType)
  );

  let NodeComponent: NodeComponentType;
  if (def) {
    NodeComponent = def.visual.component;
  } else {
    NodeComponent = () => <rect fill="red" x1={0} y1={0} x2={50} y2={50} />;
  }

  return (
    <div onMouseDown={onMouseDown}>
      {/* FIXME: Settle on a decent size and shrink overly large nodes to fit */}
      <svg width={75} height={75}>
        <NodeComponent elementState={{}} />
      </svg>
    </div>
  );
};
