import { AnyAction } from "redux";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { attachWire } from "@/actions/wire-attach";

import { nodePinDirectionSelector } from "@/services/node-graph/selectors/wires";

import { isSelectPinAction, SelectPinAction } from "../actions/select-pin";

import { selectedPinSelector } from "../selectors";

export default function selectPinReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isSelectPinAction(action)) {
    return state;
  }

  const { nodeId, pinId } = action.payload;

  const clickedPinDirection = nodePinDirectionSelector(state, {
    nodeId,
    pinId,
  });
  if (!clickedPinDirection) {
    return state;
  }

  const selectedPin = selectedPinSelector(state);
  if (!selectedPin) {
    return doSelectPinReducer(state, action);
  }

  const selectedPinDirection = nodePinDirectionSelector(state, selectedPin);
  if (!selectedPinDirection) {
    return doSelectPinReducer(state, action);
  }

  if (selectedPinDirection !== clickedPinDirection) {
    return rootReducer(state, attachWire(selectedPin, { nodeId, pinId }));
  }

  return doSelectPinReducer(state, action);
}

function doSelectPinReducer(
  state: AppState,
  action: SelectPinAction
): AppState {
  const { nodeId, pinId } = action.payload;
  return fpSet(state, "ui", "circuitEditor", "circuitField", (value) => ({
    ...value,
    selectedPin: {
      nodeId,
      pinId,
    },
  }));
}
