import { createClipboardSelector } from "../utils";

export const canPasteSelector = createClipboardSelector(
  (s) => s.clipboardElements.length > 0
);
