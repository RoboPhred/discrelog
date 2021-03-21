import { Point, ZeroPoint } from "@/geometry";

import { ClipboardElement } from "./types";

export interface ClipboardServiceState {
  clipboardElements: ClipboardElement[];
  clipboardPasteOrigin: Point;
}

export const defaultClipboardServiceState: Readonly<ClipboardServiceState> = Object.freeze(
  {
    clipboardElements: [],
    clipboardPasteOrigin: ZeroPoint,
  }
);
