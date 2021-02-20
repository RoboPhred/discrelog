import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import { MODIFIER_KEYS_NONE } from "@/modifier-keys";

import useMouseTracking from "@/hooks/useMouseTracking";
import useSelector from "@/hooks/useSelector";

import {
  nodeDefinitionFromTypeSelector,
  nodeDefinitionsSelector,
} from "@/services/node-types/selectors/node-types";

import { addNode } from "@/actions/node-add";
import { fieldDragStartNewNode } from "@/actions/field-drag-start-newnode";
import { fieldDragEnd } from "@/actions/field-drag-end";

import { WindowProps } from "../window-props";

import styles from "./NodeTrayWindow.module.css";

const NodeTrayWindow: React.FC<WindowProps> = ({ className }) => {
  const nodeDefinitions = useSelector(nodeDefinitionsSelector);
  const nodes = nodeDefinitions.map((def) => {
    return <TrayNode key={def.type} nodeType={def.type} />;
  });

  return (
    <div className={cls(styles["nodetray"], className)}>
      <div className={styles["nodetray-elements"]}>{nodes}</div>
    </div>
  );
};
export default NodeTrayWindow;

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
    [dispatch, nodeType]
  );

  const onDragStart = React.useCallback(() => {
    dispatch(fieldDragStartNewNode(nodeType));
  }, [dispatch, nodeType]);

  const onDragEnd = React.useCallback(() => {
    // We do not know the point from here, and selection mode is irrelevant.
    dispatch(fieldDragEnd({ x: -1, y: -1 }, MODIFIER_KEYS_NONE));
  }, [dispatch]);

  const { startTracking } = useMouseTracking({
    onClick,
    onDragStart,
    onDragEnd,
  });

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      startTracking(e);
    },
    [startTracking]
  );

  const def = useSelector((state) =>
    nodeDefinitionFromTypeSelector(state, nodeType)
  );

  let NodeTrayComponent: React.ComponentType;
  if (def) {
    NodeTrayComponent =
      def.visual.trayComponent ??
      (() => {
        const Component = def.visual.component;
        return <Component elementState={{}} />;
      });
  } else {
    NodeTrayComponent = () => <rect fill="red" x1={0} y1={0} x2={50} y2={50} />;
  }

  return (
    <div onMouseDown={onMouseDown}>
      {/* FIXME: Settle on a decent size and shrink overly large nodes to fit */}
      <svg width={75} height={75}>
        <NodeTrayComponent />
      </svg>
    </div>
  );
};
