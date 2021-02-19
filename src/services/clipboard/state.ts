import { Point, ZeroPoint } from "@/geometry";

import { ClipboardNode } from "./types";

export interface ClipboardServiceState {
  clipboardNodes: ClipboardNode[];
  clipboardPasteOrigin: Point;
}

export const defaultClipboardServiceState: Readonly<ClipboardServiceState> = Object.freeze(
  {
    clipboardNodes: [],
    clipboardPasteOrigin: ZeroPoint,
  }
);
