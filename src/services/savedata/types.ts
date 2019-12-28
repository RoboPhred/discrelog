import { FieldState } from "../field/state";
import { GraphState } from "../graph/state";

export interface SaveData {
  graph: GraphState;
  field: FieldState;
}
