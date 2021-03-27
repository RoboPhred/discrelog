import pick from "lodash/pick";

import { wireIdFromWireJointIdSelector } from "../../selectors/wires";
import { CircuitGraphServiceState } from "../../state";

import { WireOperationError } from "../errors/WireOperationError";

export function wireJointRemove(
  state: CircuitGraphServiceState,
  jointId: string
): CircuitGraphServiceState {
  const wireId = wireIdFromWireJointIdSelector.local(state, jointId);
  if (!wireId) {
    throw new WireOperationError("Wire for joint id not found.");
  }

  const wire = state.wiresByWireId[wireId];

  const wiresByWireId: typeof state.wiresByWireId = {
    ...state.wiresByWireId,
    [wireId]: {
      ...wire,
      wireJointIds: [...wire.wireJointIds.filter((x) => x !== jointId)],
    },
  };

  const wireJointPositionsByJointId = pick(
    state.wireJointPositionsByJointId,
    Object.keys(state.wireJointPositionsByJointId).filter((x) => x !== jointId)
  );

  return {
    ...state,
    wiresByWireId,
    wireJointPositionsByJointId,
  };
}
