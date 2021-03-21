import * as React from "react";

import {
  ElementComponentType,
  ElementVisualDefinition,
} from "@/elements/types";

import { IntegratedCircuitElementVisual } from "./IntegratedCircuitElementVisual";
import { MomentaryInteractionElementVisual } from "./MomentaryInteractionElementVisual";
import { ToggleInteractionElementVisual } from "./ToggleInteractionElementVisual";

const NamedElementComponents: Record<string, ElementComponentType> = {
  "integrated-circuit": IntegratedCircuitElementVisual,
  "interaction-momentary": MomentaryInteractionElementVisual,
  "interaction-toggle": ToggleInteractionElementVisual,
};

const ErrorComponent: React.FC<{ componentName: string }> = ({
  componentName,
}) => {
  return (
    <g>
      <rect width={50} height={50} fill="red" />
      <text x={25} y={25} alignmentBaseline="middle">
        {componentName}
      </text>
    </g>
  );
};

export function getNodeVisualElement(
  elementId: string | undefined,
  elementPath: string[] | undefined,
  evolverState: any,
  visual: ElementVisualDefinition
): JSX.Element {
  const { component, componentProps } = visual;

  const elementProps = {
    elementId,
    elementPath,
    evolverState,
    ...componentProps,
  };

  let Component: ElementComponentType;
  if (typeof component === "string") {
    Component = NamedElementComponents[component];
    if (!Component) {
      // Making a new component here each pass will invalidate the dom on every render,
      //  but this only is for exceptional error cases anyway.
      Component = () => <ErrorComponent componentName={component} />;
    }
  } else {
    Component = component;
  }

  return <Component {...elementProps} />;
}
