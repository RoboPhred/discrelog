import { AppState } from "@/store";

import { circuitIdFromConnectionIdSelector } from "./connections";

/**
 * A hideously inefficient and not react safe selector designed to
 * find the circuit a joint id belongs to.
 *
 * This exists because we have a single drag logic state across
 * multiple circuit windows, and we need to know which circuit
 * the drag operation is being performed for.
 *
 * This should be removed when the circuit-editor-ui-drag state is
 * refactored to be local to the CircuitEditor component
 */
export const circuitIdFromJointIdSelector = (
  state: AppState,
  jointId: string
) => {
  const { wireJointIdsByConnectionId } = state.services.elementLayout;
  const connectionId = Object.keys(wireJointIdsByConnectionId).find(
    (connId) => wireJointIdsByConnectionId[connId].indexOf(jointId) !== -1
  );
  if (!connectionId) {
    return null;
  }

  return circuitIdFromConnectionIdSelector(state, connectionId);
};
