import { Point } from "@/types";
import { ZeroPoint } from "@/geometry";

import { ClipboardNode } from "./types";

export interface ClipboardState {
  clipboardNodes: ClipboardNode[];
  clipboardPasteOrigin: Point;
}

export const defaultClipboardState: Readonly<ClipboardState> = Object.freeze({
  clipboardNodes: [],
  clipboardPasteOrigin: ZeroPoint,
});
