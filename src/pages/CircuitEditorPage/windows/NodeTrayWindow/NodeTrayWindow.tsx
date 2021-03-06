import * as React from "react";
import { useDispatch } from "react-redux";
import getBounds from "svg-path-bounds";
import uniq from "lodash/uniq";

import { cls } from "@/utils";

import interaction from "@/styles/interaction.module.css";

import { MODIFIER_KEYS_NONE } from "@/modifier-keys";

import useMouseTracking from "@/hooks/useMouseTracking";
import useSelector from "@/hooks/useSelector";

import {
  nodeDefinitionFromTypeSelector,
  nodeDefinitionsSelector,
} from "@/services/node-types/selectors/node-types";
import { editingCircuitIdSelector } from "@/services/circuit-editor-ui-viewport/selectors/circuit";
import { circuitIdToNodeType } from "@/services/node-types/definition-sources/integrated-circuits/utils";

import { addNode } from "@/actions/node-add";
import { fieldDragStartNewNode } from "@/actions/field-drag-start-newnode";
import { fieldDragEnd } from "@/actions/field-drag-end";

import { WindowProps } from "../window-props";

import styles from "./NodeTrayWindow.module.css";

const NodeTrayWindow: React.FC<WindowProps> = ({ className }) => {
  const nodeDefinitions = useSelector(nodeDefinitionsSelector);
  const categories = uniq(nodeDefinitions.map((x) => x.category));

  return (
    <div className={cls(styles["node-tray"], className)}>
      <ul className={styles["node-tray-elements"]}>
        {categories.map((category) => (
          <TrayCategory category={category} />
        ))}
      </ul>
    </div>
  );
};
export default NodeTrayWindow;

interface TrayCategoryProps {
  category: string;
}

const TrayCategory: React.FC<TrayCategoryProps> = ({ category }) => {
  const nodeDefinitions = useSelector(nodeDefinitionsSelector);
  const editingCircuitId = useSelector(editingCircuitIdSelector);

  let defs = nodeDefinitions.filter((def) => def.category === category);
  if (category === "ic") {
    // FIXME: This only filters out immediate parents.
    // We need to filter out all ics that also contain our editing ic.
    const editingType = circuitIdToNodeType(editingCircuitId);
    defs = defs.filter((def) => def.type !== editingType);
  }

  const nodes = defs
    .filter((def) => def.category === category)
    .map((def) => {
      return <TrayNode key={def.type} nodeType={def.type} />;
    });

  return (
    <>
      <li className={styles["node-tray-category"]}>{category}</li>
      {nodes}
    </>
  );
};

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
      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();
      startTracking(e);
    },
    [startTracking]
  );

  const def = useSelector((state) =>
    nodeDefinitionFromTypeSelector(state, nodeType)
  );

  let NodeTrayComponent: React.ComponentType;
  let displayName = nodeType;
  let viewBox = "0 0 50 50";
  if (def) {
    const { trayComponent, component, hitPath } = def.visual;
    if (trayComponent) {
      NodeTrayComponent = trayComponent;
    } else {
      NodeTrayComponent = () => {
        const Component = component;
        return <Component elementState={{}} />;
      };
      const bounds = getBounds(hitPath);
      viewBox = bounds.join(" ");
    }
    displayName = def.displayName;
  } else {
    NodeTrayComponent = () => <rect fill="red" x1={0} y1={0} x2={50} y2={50} />;
  }

  /* FIXME: Settle on a decent size and shrink overly large nodes to fit */
  return (
    <li className={styles["node-tray-item"]} onMouseDown={onMouseDown}>
      <span className={styles["node-tray-item-preview"]}>
        <svg width={30} height={30} viewBox={viewBox}>
          <NodeTrayComponent />
        </svg>
      </span>
      <span className={interaction["text-unselectable"]}>{displayName}</span>
    </li>
  );
};
