export * from "./clipboard-copy";
import { CopyNodesAction } from "./clipboard-copy";

export * from "./clipboard-paste";

export * from "./node-add";
import { AddNodeAction } from "./node-add";

export * from "./node-hover";
import { HoverNodeAction } from "./node-hover";

export * from "./node-move";
import { MoveNodesAction } from "./node-move";

export * from "./select-clear";
import { ClearSelectionAction } from "./select-clear";

export * from "./select-node";
import { SelectNodesAction } from "./select-node";

export * from "./select-region";
import { SelectRegionAction } from "./select-region";

export type CircuitEditorAction =
  | CopyNodesAction
  | AddNodeAction
  | HoverNodeAction
  | MoveNodesAction
  | ClearSelectionAction
  | SelectNodesAction
  | SelectRegionAction;
