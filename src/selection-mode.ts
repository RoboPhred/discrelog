import { keyboardIsMac } from "./runtime-env";

export type SelectionMode = "set" | "append" | "remove" | "toggle";

export function getModifiers(e: MouseEvent): ModifierKeys {
  const { ctrlKey, altKey, shiftKey, metaKey } = e;
  return {
    ctrlMetaKey: keyboardIsMac ? metaKey : ctrlKey,
    altKey: altKey,
    shiftKey,
  };
}

export function getSelectMode(modifiers: ModifierKeys): SelectionMode {
  if (modifiers.shiftKey && modifiers.ctrlMetaKey) {
    return "remove";
  }
  if (modifiers.shiftKey) {
    return "append";
  }
  if (modifiers.ctrlMetaKey) {
    return "toggle";
  }
  return "set";
}

export interface ModifierKeys {
  ctrlMetaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}
