export interface ElementVisualPathDefinition {
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

export type ElementVisualPath = string | ElementVisualPathDefinition;

export interface ElementVisualDefinition {
  /**
   * Optional SVG path string defining the hit detection of the node.
   */
  hitPath: string;

  component: ElementComponentType;
}

export interface ElementComponentProps {
  isSelected?: boolean;
  elementState: any;
}

export type ElementComponentType = React.ComponentType<ElementComponentProps>;
