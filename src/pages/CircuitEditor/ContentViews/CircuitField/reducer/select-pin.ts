import { AnyAction } from "redux";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { nodePinDirectionSelector } from "@/services/simulator/selectors/connections";
import { toggleWire } from "@/services/simulator/actions/wire-toggle";

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
    pinId
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
    return rootReducer(state, toggleWire(selectedPin, { nodeId, pinId }));
  }

  return doSelectPinReducer(state, action);
}

function doSelectPinReducer(
  state: AppState,
  action: SelectPinAction
): AppState {
  const { nodeId, pinId } = action.payload;
  let fieldState = state.ui.circuitEditor.circuitField;
  fieldState = {
    ...fieldState,
    selectedPin: {
      nodeId,
      pinId
    }
  };
  return fpSet(state, "ui", "circuitEditor", "circuitField", fieldState);
}
