import * as React from "react";

import {
  NodeComponentProps,
  NodeVisualDefinition,
} from "@/services/node-types/types";

import {
  IntegratedCircuitVisual,
  IntegratedCircuitVisualProps,
} from "./IntegratedCircuitNode";
import { MomentaryInteractionNode } from "./MomentaryInteractionNode";
import { ToggleInteractionNode } from "./ToggleInteractionNode";

export function getNodeVisualElement(
  circuitNodeId: string | undefined,
  circuitNodePath: string[] | undefined,
  elementState: any,
  visual: NodeVisualDefinition
): JSX.Element {
  const nodeProps: NodeComponentProps = {
    circuitNodeId,
    circuitNodePath,
    elementState,
  };

  const { component, componentProps } = visual;
  if (typeof component === "string") {
    switch (component) {
      case "integrated-circuit": {
        const inputProps = componentProps as IntegratedCircuitVisualProps;
        return <IntegratedCircuitVisual {...nodeProps} {...inputProps} />;
      }
      case "interaction-momentary": {
        return <MomentaryInteractionNode {...nodeProps} />;
      }
      case "interaction-toggle":
        return <ToggleInteractionNode {...nodeProps} />;
      default:
        throw new Error("Unknown named component.");
    }
  }

  const Component = component;
  return <Component {...nodeProps} />;
}
