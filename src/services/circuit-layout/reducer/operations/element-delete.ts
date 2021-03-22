import difference from "lodash/difference";
import pick from "lodash/pick";
import flatMap from "lodash/flatMap";

import { AppState } from "@/store";

import {
  connectionsByIdSelector,
  elementInputConnectionIdsFromElementIdSelector,
  elementOutputConnectionIdsFromElementIdSelector,
} from "@/services/circuit-graph/selectors/connections";

import { CircuitLayoutServiceState } from "../../state";
import { elementPinsFromPinElementSelector } from "@/services/circuit-graph/selectors/pins";
import { elementPinEquals } from "@/services/circuit-graph/types";

export default function elementDelete(
  state: CircuitLayoutServiceState,
  elementIds: string[],
  rootState: AppState
): CircuitLayoutServiceState {
  // Connection ids connected to elements being removed.
  const removingElementConnectionIds = elementIds.reduce(
    (connectionIds, elementId) => {
      // Get all inputs and outputs to the element.
      const inputs = elementInputConnectionIdsFromElementIdSelector(
        rootState,
        elementId
      );
      const outputs = elementOutputConnectionIdsFromElementIdSelector(
        rootState,
        elementId
      );

      connectionIds.push(...inputs, ...outputs);

      return connectionIds;
    },
    [] as string[]
  );

  // Connections going to IC element pins whose pin elements were removed.
  const removedIcPins = flatMap(elementIds, (elementId) =>
    // If not a pin, this will return an empty array.
    elementPinsFromPinElementSelector(rootState, elementId)
  );
  const connectionsById = connectionsByIdSelector(rootState);
  const removingPinConnectionIds = Object.keys(connectionsById).filter(
    (connectionId) => {
      const { inputPin, outputPin } = connectionsById[connectionId];
      // We will need to remove this connection if it went to a pin generated by
      // an input or output pin element being removed.
      return removedIcPins.some(
        (removedPin) =>
          elementPinEquals(removedPin, inputPin) ||
          elementPinEquals(removedPin, outputPin)
      );
    }
  );

  const removingConnectionIds = [
    ...removingElementConnectionIds,
    ...removingPinConnectionIds,
  ];

  // Remove any joint that is part of a removed connection.
  const removingJointIds = removingConnectionIds.reduce(
    (jointIds, connectionId) => {
      jointIds.push(...state.wireJointIdsByConnectionId[connectionId]);
      return jointIds;
    },
    [] as string[]
  );

  const remainingConnectionIds = difference(
    Object.keys(state.wireJointIdsByConnectionId),
    removingElementConnectionIds
  );

  const remainingJointIds = difference(
    Object.keys(state.wireJointPositionsByJointId),
    removingJointIds
  );

  const remainingElementIds = difference(
    Object.keys(state.elementPositionsById),
    elementIds
  );

  return {
    ...state,
    elementPositionsById: pick(state.elementPositionsById, remainingElementIds),
    wireJointIdsByConnectionId: pick(
      state.wireJointIdsByConnectionId,
      remainingConnectionIds
    ),
    wireJointPositionsByJointId: pick(
      state.wireJointPositionsByJointId,
      remainingJointIds
    ),
  };
}
