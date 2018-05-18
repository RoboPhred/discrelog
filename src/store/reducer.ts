import { Action, combineReducers } from "redux";

import simulator from "@/services/simulator/reducer";

import circuitEditor from "@/pages/CircuitEditor/reducer";

import { State, defaultState } from "./state";

export default combineReducers<State>({
  services: combineReducers({
    simulator
  }),
  ui: combineReducers({
    circuitEditor
  })
});
