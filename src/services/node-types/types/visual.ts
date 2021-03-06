export interface NodeVisualDefinition {
  /**
   * SVG path string defining the hit area of the node.
   * Used for selection.
   */
  hitPath: string;

  trayComponent?: React.ComponentType;
  component: NodeComponentType;
}

// TODO: Many of these are optional because these are also used as tray components.
//  Should remove components as tray components and rely on the trayComponent def.
export interface NodeComponentProps {
  /**
   * The circuit node id, if this node is in a circuit.
   */
  circuitNodeId?: string;

  // TODO: Nodes can be made of multiple elements.
  // Allow specifying tag names for element productions, and receive
  //  a record of tag names to element states.
  /**
   * The current state of the element for this node.
   */
  elementState: any;
}

export type NodeComponentType = React.ComponentType<NodeComponentProps>;
