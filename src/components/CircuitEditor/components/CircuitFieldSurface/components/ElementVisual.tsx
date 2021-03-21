import * as React from "react";

import { cls } from "@/utils";

import useSelector from "@/hooks/useSelector";

import { elementDefinitionFromTypeSelector } from "@/services/element-types/selectors/element-types";
import { getNodeVisualElement } from "@/elements/visuals";

export interface ElementVisualProps {
  className?: string;
  elementId?: string;
  x?: number;
  y?: number;
  elementType: string;
}

const EmptyState = Object.freeze({});

const ElementVisual: React.FC<ElementVisualProps> = React.memo(
  function ElementVisual({ className, elementId, x = 0, y = 0, elementType }) {
    const def = useSelector((state) =>
      elementDefinitionFromTypeSelector(state, elementType)
    );

    let body: React.ReactNode;
    if (!def) {
      body = <rect x={x} y={y} width={50} height={50} fill="red" />;
    } else {
      body = getNodeVisualElement(elementId, [], EmptyState, def.visual);
    }

    const transform = x != 0 || y != 0 ? `translate(${x}, ${y})` : undefined;
    return (
      <g className={cls(className, "element-visual")} transform={transform}>
        {body}
      </g>
    );
  }
);

export default ElementVisual;
