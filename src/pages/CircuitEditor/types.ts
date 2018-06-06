import { IDMap, Point } from "@/types";

import { NodePinConnection } from "@/services/simulator/types";
import { NodeType } from "@/services/simulator/node-types";

export interface ClipboardNode {
  id: string;
  type: NodeType;
  offset: Point;
  outputs: IDMap<NodePinConnection[]>;
}
