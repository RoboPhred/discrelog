import { v4 as uuidV4 } from "uuid";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import findIndex from "lodash/findIndex";
import zipObject from "lodash/zipObject";

import { pointSubtract } from "@/geometry";

import { isCopyElementsAction } from "@/actions/clipboard-copy-elements";

import { elementFromElementIdSelector } from "@/services/circuit-graph/selectors/elements";
import { elementOutputSourcesByPinIdFromElementIdSelector } from "@/services/circuit-graph/selectors/pins";
import { elementPositionsByElementIdSelector } from "@/services/circuit-layout/selectors/element-positions";
import { connectionIdFromInputPinSelector } from "@/services/circuit-graph/selectors/connections";
import {
  wireJointIdsFromConnectionIdSelector,
  wireJointPositionFromJointIdSelector,
} from "@/services/circuit-layout/selectors/wires";

import { ClipboardElement } from "../types";
import { createClipboardReducer } from "../utils";

export default createClipboardReducer((state, action, appState) => {
  if (!isCopyElementsAction(action)) {
    return state;
  }

  const { elementIds } = action.payload;
  if (elementIds.length === 0) {
    return state;
  }

  const elementPositionsById = elementPositionsByElementIdSelector(appState);

  const copyIds = zipObject(
    elementIds,
    map(elementIds, () => uuidV4())
  );

  function elementIsSelected(id: string): boolean {
    return findIndex(elementIds, (x) => x === id) !== -1;
  }

  const rootPosition = elementPositionsById[elementIds[0]];

  const copyElements: ClipboardElement[] = elementIds.map((elementId) => {
    const element = elementFromElementIdSelector(appState, elementId);
    const outputs = elementOutputSourcesByPinIdFromElementIdSelector(
      appState,
      elementId
    );
    const copyElement: ClipboardElement = {
      id: copyIds[elementId],
      elementType: element.elementType,
      offset: pointSubtract(elementPositionsById[elementId], rootPosition),
      outputs: mapValues(outputs, (pins) =>
        pins
          .filter((x) => elementIsSelected(x.elementId))
          .map((pin) => {
            const connId = connectionIdFromInputPinSelector(appState, pin);
            const jointIds = connId
              ? wireJointIdsFromConnectionIdSelector(appState, connId)
              : [];
            const joints = jointIds
              .map((id) => wireJointPositionFromJointIdSelector(appState, id))
              .map((jointPos) => pointSubtract(jointPos, rootPosition));
            return {
              pin: {
                elementId: copyIds[pin.elementId],
                pinId: pin.pinId,
              },
              joints,
            };
          })
      ),
    };
    return copyElement;
  });

  return {
    ...state,
    clipboardElements: copyElements,
    clipboardPasteOrigin: rootPosition,
  };
});
