import * as React from "react";

import { createSelector } from "reselect";
import sortBy from "lodash/sortBy";
import getBounds from "svg-path-bounds";

import { PinDirection } from "@/logic";
import { boundsToRect, Point } from "@/geometry";

import { IntegratedCircuitElementVisualProps } from "@/elements/visuals/IntegratedCircuitElementVisual";

import { elementIdsByCircuitIdSelector } from "@/services/circuit-graph/selectors/elements";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";
import { elementTypesByElementIdSelector } from "@/services/circuit-graph/selectors/elements";
import { elementPositionsByElementIdSelector } from "@/services/circuit-layout/selectors/element-positions";
import { circuitNamesByIdSelector } from "@/services/circuit-properties/selectors/circuits";

import {
  ElementDefinition,
  ElementDefinitionSource,
  ElementPinDefinition,
} from "../../types";

import { circuitIdToElementType, getICBorderPath } from "./utils";

const IntegratedCircuitDefinitionSource: ElementDefinitionSource = createSelector(
  elementIdsByCircuitIdSelector,
  elementTypesByElementIdSelector,
  elementPositionsByElementIdSelector,
  circuitNamesByIdSelector,
  (
    elementIdsByCircuitId,
    elementTypesByElementId,
    elementPositionsByElementId,
    circuitNamesById
  ) => {
    return Object.keys(elementIdsByCircuitId)
      .filter((x) => x !== ROOT_CIRCUIT_ID)
      .map((circuitId) => {
        const elementIds = elementIdsByCircuitId[circuitId] ?? [];
        const circuitName =
          circuitNamesById[circuitId] ?? circuitId.substr(0, 5);

        // Sort by y axis position to get consistent pin locations.
        let pinElementIds = elementIds.filter((elementId) =>
          elementTypesByElementId[elementId].startsWith("pin-")
        );
        pinElementIds = sortBy(
          pinElementIds,
          (elementId) => elementPositionsByElementId[elementId].y,
          (elementId) => elementPositionsByElementId[elementId].x
        );

        const pins: Record<string, ElementPinDefinition> = {};
        const inputPinIds: string[] = [];
        const outputPinIds: string[] = [];
        for (const pinElementId of pinElementIds) {
          const type = elementTypesByElementId[pinElementId];
          if (type === "pin-input") {
            pins[pinElementId] = {
              direction: "input",
              ...circuitPinPosition(inputPinIds.length, "input"),
            };
            inputPinIds.push(pinElementId);
          } else if (type === "pin-output") {
            pins[pinElementId] = {
              direction: "output",
              ...circuitPinPosition(outputPinIds.length, "output"),
            };
            outputPinIds.push(pinElementId);
          }
        }

        const componentProps: IntegratedCircuitElementVisualProps = {
          circuitId,
          inputPinIds,
          outputPinIds,
        };

        const def: ElementDefinition = {
          type: circuitIdToElementType(circuitId),
          category: "integrated-circuit",
          displayName: circuitName,
          elementProduction: {
            type: "circuit",
            circuitId,
          },
          visual: {
            hitRect: boundsToRect(
              getBounds(
                getICBorderPath(inputPinIds.length, outputPinIds.length)
              )
            ),
            trayComponent: () => (
              <g stroke="black" strokeWidth={1}>
                <rect x={10} y={10} width={30} height={30} fill="none" />

                <line x1={10} y1={15} x2={5} y2={15} />
                <line x1={40} y1={15} x2={45} y2={15} />

                <line x1={10} y1={35} x2={5} y2={35} />
                <line x1={40} y1={35} x2={45} y2={35} />
              </g>
            ),
            component: "integrated-circuit",
            componentProps,
          },
          pins,
        };
        return def;
      });
  }
);

export default [IntegratedCircuitDefinitionSource];

function circuitPinPosition(pinIndex: number, direction: PinDirection): Point {
  return {
    x: direction === "input" ? 0 : 100,
    y: pinIndex * 50 + 25,
  };
}
