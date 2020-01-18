import { Reducer, AnyAction } from "redux";

import { AppState } from "./state";

export type AppReducer = Reducer<AppState, AnyAction> & { weight?: number };
