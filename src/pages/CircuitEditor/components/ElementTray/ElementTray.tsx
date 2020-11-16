import * as React from "react";
import { useDispatch } from "react-redux";

import { typedKeys } from "@/utils";
import {
  ElementDefinitionsByType,
  ElementType,
  LargestElementSize,
} from "@/element-defs";

import useMouseTracking from "@/hooks/useMouseTracking";

import { addElement } from "@/actions/element-add";
import { fieldDragStartNewNode } from "@/actions/field-drag-start-newnode";
import { fieldDragEnd } from "@/actions/field-drag-end";

import ElementVisual from "../ElementVisual";

import styles from "./ElementTray.module.css";

const ElementTray: React.FC = () => {
  const elements = typedKeys(ElementDefinitionsByType).map((type) => {
    return <Element key={type} nodeType={type} />;
  });

  return (
    <div className={styles["circuittray"]}>
      <div className={styles["circuittray-elements"]}>{elements}</div>
    </div>
  );
};
export default ElementTray;

interface ElementProps {
  nodeType: ElementType;
}
const Element: React.FC<ElementProps> = ({ nodeType }) => {
  const dispatch = useDispatch();
  const onClick = React.useCallback(
    (e: MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      dispatch(addElement(nodeType));
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
      <svg width={LargestElementSize.width} height={LargestElementSize.height}>
        <ElementVisual elementType={nodeType} nodeState={{}} />
      </svg>
    </div>
  );
};
