import { Action, combineReducers } from "redux";

import simulator from "@/services/simulator/reducer";

import circuitEditor from "@/pages/CircuitEditor/reducer";

import { AppState, defaultAppState } from "./state";

export default combineReducers<AppState>({
  services: combineReducers({
    simulator
  }),
  ui: combineReducers({
    circuitEditor
  })
});
