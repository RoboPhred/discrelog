interface Window {
  __REDUX_DEVTOOLS_EXTENSION__?(): any;
}

declare type Omit<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

declare module "react-sizeme" {
  export interface SizeConfig {
    monitorWidth?: boolean;
    monitorHeight?: boolean;
  }

  export interface SizeProps {
    size: {
      width: number;
      height: number;
    };
  }

  type SizemeDecorator<TProps extends SizeProps> = (component: React.ComponentClass<TProps>) => React.ComponentClass<Omit<TProps, keyof SizeProps>>;
  function sizeme<TProps extends SizeProps>(config: SizeConfig): SizemeDecorator<TProps>;
  export default sizeme;
}
