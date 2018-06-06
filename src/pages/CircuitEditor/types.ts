import { IDMap, Position } from "@/types";

import { NodePinConnection } from "@/services/simulator/types";
import { NodeType } from "@/services/simulator/node-types";

export interface ClipboardNode {
  id: string;
  type: NodeType;
  offset: Position;
  outputs: IDMap<NodePinConnection[]>;
}
