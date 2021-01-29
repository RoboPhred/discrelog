import * as React from "react";
import { useDispatch } from "react-redux";

import { typedKeys } from "@/utils";
import {
  ElementComponentType,
  ElementDefinitionsByType,
  ElementType,
  LargestElementSize,
} from "@/elements";

import useMouseTracking from "@/hooks/useMouseTracking";

import { addElement } from "@/actions/element-add";
import { fieldDragStartNewNode } from "@/actions/field-drag-start-newnode";
import { fieldDragEnd } from "@/actions/field-drag-end";

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

  const def = ElementDefinitionsByType[nodeType];
  let ElementComponent: ElementComponentType;
  if (def) {
    ElementComponent = def.visual.component;
  } else {
    ElementComponent = () => <rect fill="red" x1={0} y1={0} x2={50} y2={50} />;
  }

  return (
    <div onMouseDown={onMouseDown}>
      <svg width={LargestElementSize.width} height={LargestElementSize.height}>
        <ElementComponent elementState={{}} />
      </svg>
    </div>
  );
};
