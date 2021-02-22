interface ShowSaveFilePickerOpts {
  types: {
    description: string;
    accept: Record<string, string[]>;
  }[];
}
interface FileHandle {
  createWritable(): Promise<FileSystemWritableStream>;
}

interface FileSystemWritableStream {
  write(contents: any): Promise<void>;
  close(): Promise<void>;
}

interface Window {
  __REDUX_DEVTOOLS_EXTENSION__?(): any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (...args: any[]) => any;
  showSaveFilePicker?(opts: ShowSaveFilePickerOpts): Promise<FileHandle>;
}

declare let __webpack_public_path__: string;

declare type HotkeyHandler = (keyEvent?: KeyboardEvent) => void;

type IsFunction<T> = T extends (...args: any[]) => any ? T : never;
type ObjectValueReturnTypes<T> = {
  [P in keyof T]: ReturnType<IsFunction<T[P]>>;
};

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.md" {
  const value: string;
  export = value;
}

declare module "svg-path-bounds" {
  function getBounds(path: string): [number, number, number, number];
  export = getBounds;
}
