import { createSelector } from "reselect";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector } from "../utils";
import {
  ElementConnection,
  isInputOutputWireSegment,
  isInputWireSegment,
  isOutputWireSegment,
} from "../types";

export const connectionsSelector = createCircuitGraphSelector(
  createSelector(
    (state: CircuitGraphServiceState) => state.wiresByWireId,
    (state: CircuitGraphServiceState) => state.wireSegmentsById,
    (wiresById, segmentsById) => {
      const connections: ElementConnection[] = [];

      const wireIds = Object.keys(wiresById);
      for (const wireId of wireIds) {
        const { wireSegmentIds } = wiresById[wireId];
        const segments = wireSegmentIds.map((id) => segmentsById[id]);
        for (const segment of segments) {
          if (isInputOutputWireSegment(segment)) {
            connections.push({
              inputPin: segment.inputPin,
              outputPin: segment.outputPin,
            });
          } else if (isOutputWireSegment(segment)) {
            const inputs = segments
              .filter(isInputWireSegment)
              .filter(({ lineId }) => lineId === segment.lineId);
            for (const input of inputs) {
              connections.push({
                outputPin: segment.outputPin,
                inputPin: input.inputPin,
              });
            }
          }
        }
      }

      return connections;
    }
  )
);
