
import { Action } from "redux";

import { State, defaultState } from "./state";

export function reducer(state: State = defaultState, action: Action): State {
    return state;
}