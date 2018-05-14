
import { Action, combineReducers } from "redux";

import simulator from "../services/simulator/reducer";

import { State, defaultState } from "./state";

const reducer = combineReducers<State>({
    simulator 
});
export default reducer;

// export function reducer(state: State = defaultState, action: Action): State {
//     return state;
// }