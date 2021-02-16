import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

import { NodePin } from "../node-graph/types";
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

  /**
   * The current drag operation being performed by the ui.
   */
  dragMode: "move" | "select" | "new-node" | "wire" | null;

  /**
   * The modifier keys in play for the drag operation.
   */
  dragModifierKeys: ModifierKeys | null;

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
   * If dragMode is "new-node", this holds the node type being created.
   */
  dragNewNodeType: string | null;

  /**
   * If drag mode is "wire", this is the source pin being wired by the drag.
   */
  dragWireSource: NodePin | null;
}

const _defaultState: CircuitEditorUiState = {
  editingCircuitId: ROOT_CIRCUIT_ID,
  viewScale: 1,
  dragMode: null,
  dragModifierKeys: null,
  dragStart: null,
  dragEnd: null,
  dragNewNodeType: null,
  dragWireSource: null,
};

export const defaultCircuitEditorUiState = Object.freeze(_defaultState);
