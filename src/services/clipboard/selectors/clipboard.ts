import { createClipboardSelector } from "../utils";

export const canPasteSelector = createClipboardSelector(
  (s) => s.clipboardNodes.length > 0
);
