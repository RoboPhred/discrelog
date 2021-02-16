export interface NodeVisualDefinition {
  /**
   * Optional SVG path string defining the hit detection of the node.
   */
  hitPath: string;

  trayComponent?: React.ComponentType;
  component: NodeComponentType;
}

export interface NodeComponentProps {
  isSelected?: boolean;
  // FIXME: Nodes can be made of multiple elements.
  // Allow specifying tag names for element productions, and receive
  //  a record of tag names to element states.
  elementState: any;
}

export type NodeComponentType = React.ComponentType<NodeComponentProps>;
