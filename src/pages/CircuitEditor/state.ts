
import {
    Position,
    Size
} from "@/types";

export interface CircuitEditorState {
    fieldSize: Size;
    nodePositions: {
        [key: string]: Position;
    };
}

export const defaultCircuitEditorState: CircuitEditorState = {
    fieldSize: {
        width: 300,
        height: 200
    },
    nodePositions: {
        "toggle-a": {
            x: 0,
            y: 0
        },
        "toggle-b": {
            x: 0,
            y: 100
        },
        "and": {
            x: 100,
            y: 50
        },
        "out-led": {
            x: 200,
            y: 50
        }
    }
}
