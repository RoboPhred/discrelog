export interface NodeVisualPathDefinition {
  /**
   * The svg path of this visual element.
   */
  path: string;
  /**
   * The fill or fill-producing function for this visual element.
   */
  fill?: string | ((state: any) => string);
  stroke?: string | ((state: any) => string);
  strokeWidth?: number | ((state: any) => number);
}

export type NodeVisualPath = string | NodeVisualPathDefinition;

export interface NodeVisualDefinition {
  /**
   * Optional SVG path string defining the hit detection of the node.
   */
  hitPath: string;

  component: NodeComponentType;
}

export interface NodeComponentProps {
  isSelected?: boolean;
  elementState: any;
}

export type NodeComponentType = React.ComponentType<NodeComponentProps>;
