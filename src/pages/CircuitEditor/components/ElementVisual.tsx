import * as React from "react";

import {
  ElementType,
  ElementTypes,
  ElementPinDefinition,
  PinDirection,
} from "@/element-defs";
import { normalizeVisuals } from "@/element-defs/utils";

export interface RenderPinProps extends ElementPinDefinition {
  id: string;
  direction: PinDirection;
}
export interface ElementVisualProps {
  x?: number;
  y?: number;
  elementType: ElementType;
  nodeState: any;
  colorOverride?: string;
  renderPin?(props: RenderPinProps): React.ReactElement<any>;
  onClick?(e: React.MouseEvent): void;
  onMouseDown?(e: React.MouseEvent): void;
  onMouseOver?(e: React.MouseEvent): void;
  onMouseUp?(e: React.MouseEvent): void;
  onMouseLeave?(e: React.MouseEvent): void;
}

const ElementVisual: React.FC<ElementVisualProps> = ({
  x = 0,
  y = 0,
  elementType,
  nodeState,
  colorOverride,
  renderPin,
  onClick,
  onMouseDown,
  onMouseOver,
  onMouseUp,
  onMouseLeave,
}) => {
  const def = ElementTypes[elementType];

  let body: React.ReactNode;
  let hitPath: string | undefined;
  let pins: React.ReactNode = null;
  if (!def) {
    body = <rect x={x} y={y} width={50} height={50} fill="red" />;
  } else {
    const { shapePath } = def.visual;
    const visuals = normalizeVisuals(shapePath, nodeState);
    body = visuals.map((v, i) => (
      <path
        key={i}
        d={v.path}
        fill={colorOverride || v.fill}
        stroke={colorOverride || v.stroke}
        strokeWidth={v.strokeWidth}
      />
    ));
    hitPath = def.visual.hitPath;

    if (renderPin) {
      pins = Object.keys(def.pins).map((key) => {
        const pin = def.pins[key];
        let element = renderPin({
          id: key,
          ...pin,
        });
        return React.cloneElement(element, { key: `input-${key}` });
      });
    }
  }

  const transform = x != 0 || y != 0 ? `translate(${x}, ${y})` : undefined;
  return (
    <g
      className="node-visual"
      transform={transform}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {hitPath && <path d={hitPath} fill="transparent" onClick={onClick} />}
      {body}
      {pins}
    </g>
  );
};

export default ElementVisual;
