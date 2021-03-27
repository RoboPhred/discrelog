import { Point } from "@/geometry";

import { CircuitGraphServiceState } from "../../state";

export function wireJointInsert(
  state: CircuitGraphServiceState,
  wireId: string,
  jointId: string,
  point: Point
): CircuitGraphServiceState {
  state = {
    ...state,
    wiresByWireId: {
      ...state.wiresByWireId,
      [wireId]: {
        ...state.wiresByWireId[wireId],
        wireJointIds: [...state.wiresByWireId[wireId].wireJointIds, jointId],
      },
    },
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      [jointId]: point,
    },
  };

  return state;
}
