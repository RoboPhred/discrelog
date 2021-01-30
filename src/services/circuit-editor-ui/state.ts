import { ElementType } from "@/elements";
import { Point } from "@/geometry";
import { NodePin } from "../circuit-graph/types";
import { ROOT_CIRCUIT_ID } from "../circuits/constants";

export interface CircuitEditorUiState {
  /**
   * The id of the circuit currently being edited.
   */
  editingCircuitId: string;

  /**
   * The scaling for rendering the circuit in the UI.
   */
  viewScale: number;

  // TODO: Drag stuff should probably be its own service.
  /**
   * The current drag operation being performed by the ui.
   */
  dragMode: "move" | "select" | "new-element" | "wire" | null;
  /**
   * The start of the drag operation, if applicable for the current operation.
   */
  dragStart: Point | null;
  /**
   * The current end point for the drag operation.  This does not indicate the final
   * drag position, but the cumulative position.
   */
  dragEnd: Point | null;
  /**
   * If dragMode is "new-element", this holds the element type being created.
   */
  dragNewElementType: ElementType | null;
  /**
   * If drag mode is "wire", this is the source pin being wired by the drag.
   */
  dragWireSource: NodePin | null;
}

const _defaultState: CircuitEditorUiState = {
  editingCircuitId: ROOT_CIRCUIT_ID,
  viewScale: 1,
  dragMode: null,
  dragStart: null,
  dragEnd: null,
  dragNewElementType: null,
  dragWireSource: null,
};

export const defaultCircuitEditorUiState = Object.freeze(_defaultState);
