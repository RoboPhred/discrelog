import * as React from "react";

import { Rectangle } from "@/geometry";

import { ElementVisualDefinition } from "../types";

const TrayComponentPadding = 5;

export function createStaticElementVisual(
  hitRect: Rectangle,
  element: JSX.Element
): ElementVisualDefinition {
  return {
    hitRect,
    trayComponent: () => (
      <svg
        width={50}
        height={50}
        viewBox={`${hitRect.p1.x - TrayComponentPadding} ${
          hitRect.p1.y - TrayComponentPadding
        } ${hitRect.p2.x - hitRect.p1.x + TrayComponentPadding * 2} ${
          hitRect.p2.y - hitRect.p1.y + TrayComponentPadding * 2
        }`}
      >
        {element}
      </svg>
    ),
    component: () => element,
  };
}
