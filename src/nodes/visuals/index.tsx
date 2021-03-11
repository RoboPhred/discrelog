import * as React from "react";

import { NodeComponentType, NodeVisualDefinition } from "@/nodes/types";

import { IntegratedCircuitVisual } from "./IntegratedCircuitNode";
import { MomentaryInteractionNode } from "./MomentaryInteractionNode";
import { ToggleInteractionNode } from "./ToggleInteractionNode";

const NamedNodeComponents: Record<string, NodeComponentType> = {
  "integrated-circuit": IntegratedCircuitVisual,
  "interaction-momentary": MomentaryInteractionNode,
  "interaction-toggle": ToggleInteractionNode,
};

const ErrorComponent: React.FC<{ componentName: string }> = ({
  componentName,
}) => {
  return (
    <g>
      <rect width={50} height={50} fill="red" />
      <text>{componentName}</text>
    </g>
  );
};

export function getNodeVisualElement(
  circuitNodeId: string | undefined,
  circuitNodePath: string[] | undefined,
  elementState: any,
  visual: NodeVisualDefinition
): JSX.Element {
  const { component, componentProps } = visual;

  const nodeProps = {
    circuitNodeId,
    circuitNodePath,
    elementState,
    ...componentProps,
  };

  let Component: NodeComponentType;
  if (typeof component === "string") {
    Component = NamedNodeComponents[component];
    if (!Component) {
      Component = () => <ErrorComponent componentName={component} />;
    }
  } else {
    Component = component;
  }

  return <Component {...nodeProps} />;
}
