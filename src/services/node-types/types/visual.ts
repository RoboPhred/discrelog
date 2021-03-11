import { Rectangle } from "@/geometry";

export interface NodeVisualDefinition {
  /**
   * Rectangle relative to the node's position defining the hit area of the node.
   * Used to calculate selected nodes during region selections.
   */
  hitRect: Rectangle;

  trayComponent?: React.ComponentType;
  component: string | NodeComponentType;
  componentProps?: Record<string, any>;
}

// TODO: Many of these are optional because these are also used as tray components.
//  Should remove components as tray components and rely on the trayComponent def.
export interface NodeComponentProps<TState = any> {
  /**
   * The circuit node id, if this node is in a circuit.
   */
  circuitNodeId?: string;

  /**
   * The IC node path to the specific instance of this circuit node.
   */
  circuitNodePath?: string[];

  // TODO: Nodes can be made of multiple elements.
  // Allow specifying tag names for element productions, and receive
  //  a record of tag names to element states.
  /**
   * The current state of the element for this node.
   */
  elementState?: TState;
}

export type NodeComponentType = React.ComponentType<NodeComponentProps>;
