import { Rectangle } from "@/geometry";

export interface ElementVisualDefinition {
  /**
   * Rectangle relative to the element's position defining the hit area of the element.
   * Used to calculate selection during region selections.
   */
  hitRect: Rectangle;

  /**
   * The react component to render when previewing the element on the element tray.
   */
  trayComponent?: React.ComponentType;

  /**
   * The react component or component identifier to use when rendering
   * the element in the field.
   *
   * This can either be a react component type, or a string identifying a preconfigured
   * react component type.
   *
   * Note that if a component requires state data that is derived from element definitions,
   * then importing and using its component directly can cause circular dependencies to form.
   * To fix this, make the component a named entry in ../visuals/index.ts and set
   * this property to the component name.
   */
  component: string | ElementComponentType;

  /**
   * Extra properties to pass to the component when rendered on a circuit field.
   */
  componentProps?: Record<string, any>;
}

// TODO: Many of these are optional because these are also used as tray components.
//  Should remove components as tray components and rely on the trayComponent def.
export interface ElementComponentProps<TState = any> {
  /**
   * The element id, if this element is in a circuit.
   */
  elementId?: string;

  /**
   * The path of ic element ids to the specific instance of this element.
   */
  elementPath?: string[];

  /**
   * The current state of the evolver for this element.
   */
  evolverState?: TState;
}

export type ElementComponentType<P = any> = React.ComponentType<
  ElementComponentProps & P
>;
