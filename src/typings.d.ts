interface Window {
  __REDUX_DEVTOOLS_EXTENSION__?(): any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: Function;
}

interface KonvaMouseEvent {
  evt: MouseEvent;
}

// FIXME: Chrome only.  Do not use.
interface MouseEvent {
  layerX: number;
  layerY: number;
}

declare type HotkeyHandler = (keyEvent?: KeyboardEvent) => void;

type IsFunction<T> = T extends (...args: any[]) => any ? T : never;
type ObjectValueReturnTypes<T> = {
  [P in keyof T]: ReturnType<IsFunction<T[P]>>;
};

declare module "*.md" {
  const value: string;
  export = value;
}

declare module "react-sizeme" {
  export interface SizeConfig {
    monitorWidth?: boolean;
    monitorHeight?: boolean;
    noPlaceholder?: boolean;
  }

  export interface SizeProps {
    size: {
      width: number;
      height: number;
    };
  }

  type SizemeDecorator<TProps extends SizeProps> = (
    component: React.ComponentClass<TProps>
  ) => React.ComponentClass<Omit<TProps, keyof SizeProps>>;
  function sizeme<TProps extends SizeProps>(
    config: SizeConfig
  ): SizemeDecorator<TProps>;
  export default sizeme;
}

declare module "svg-path-bounds" {
  function getBounds(path: string): [number, number, number, number];
  export = getBounds;
}
