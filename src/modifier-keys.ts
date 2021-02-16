import { keyboardIsMac } from "./runtime-env";

export const MODIFIER_KEYS_NONE = Object.freeze<ModifierKeys>({});

export interface ModifierKeys {
  ctrlMetaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export interface MouseEventModifierKeys {
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}
export function getModifiers(e: MouseEventModifierKeys): ModifierKeys {
  const { ctrlKey, altKey, shiftKey, metaKey } = e;
  return {
    // Mac reserves ctrl for system use, apps use meta.
    ctrlMetaKey: keyboardIsMac ? metaKey : ctrlKey,
    altKey,
    shiftKey,
  };
}
