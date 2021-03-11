import { Rectangle } from "@/geometry";

export interface NodeVisualDefinition {
  /**
   * Rectangle relative to the node's position defining the hit area of the node.
   * Used to calculate selected nodes during region selections.
   */
  hitRect: Rectangle;

  /**
   * The react component to render when previewing the node on the node tray.
   */
  trayComponent?: React.ComponentType;

  /**
   * The react component or component identifier to use when rendering
   * the node in the field.
   *
   * This can either be a react component type, or a string identifying a preconfigured
   * react component type.
   *
   * Note that if a component requires state data that is derived from node definitions,
   * then importing and using its component directly can cause circular dependencies to form.
   * To fix this, make the component a named entry in ../visuals/index.ts and set
   * this property to the component name.
   */
  component: string | NodeComponentType;

  /**
   * Extra properties to pass to the component when rendered on a circuit field.
   */
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

export type NodeComponentType<P = any> = React.ComponentType<
  NodeComponentProps & P
>;
