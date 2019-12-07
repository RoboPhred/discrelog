import * as React from "react";

import { connect } from "react-redux";

import sizeme, { SizeProps } from "react-sizeme";
import { HotKeys } from "react-hotkeys";

import { keyboardIsMac } from "@/runtime-env";

import { Point } from "@/types";
import { bindFuncMap } from "@/utils";

import keymap, {
  KeymapHandler,
  KEYMAP_SIM_STEP,
  KEYMAP_SIM_FASTFORWARD,
  KEYMAP_NODE_COPY,
  KEYMAP_NODE_PASTE,
  KEYMAP_NODE_DELETE
} from "./keymap";

import FieldContainer from "./components/FieldContainer";
import DragPreviewLayer from "./components/DragPreviewLayer";
import DragSelectLayer from "./components/DragSelectLayer";
import WiresLayer from "./components/WiresLayer";
import NodesLayer from "./components/NodesLayer";

import * as events from "./events";
import { getFieldCoord } from "./utils";

export interface CircuitFieldProps {
  className?: string;
}

const mapDispatchToProps = events;
type DispatchProps = typeof mapDispatchToProps;

const DRAG_THRESHOLD = 5;

type Props = CircuitFieldProps & SizeProps & DispatchProps;
class CircuitField extends React.Component<Props> {
  // Instance props as we do not require a re-render when these change.
  private _isDragging: boolean = false;
  private _mouseDownNodeId: string | null = null;
  private _mouseDownPinId: string | null = null;
  private _startMousePos: Point | null = null;

  private _hotkeysRef = React.createRef<HTMLDivElement>();
  private _svgRef = React.createRef<SVGSVGElement>();

  constructor(props: Props) {
    super(props);

    this._onNodeMouseDown = this._onNodeMouseDown.bind(this);
    this._onNodeMouseOver = this._onNodeMouseOver.bind(this);
    this._onNodeMouseLeave = this._onNodeMouseLeave.bind(this);
    this._onNodePinMouseDown = this._onNodePinMouseDown.bind(this);
    this._onNodePinMouseUp = this._onNodePinMouseUp.bind(this);

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this._keyHandlers = bindFuncMap(this._keyHandlers, this);
  }

  render() {
    const {
      className,
      size: { width, height }
    } = this.props;

    return (
      <FieldContainer className={className}>
        <HotKeys keyMap={keymap} handlers={this._keyHandlers}>
          <div tabIndex={-1} ref={this._hotkeysRef}>
            <svg
              ref={this._svgRef}
              width={width}
              height={height}
              onMouseDown={this._onMouseDown}
              onMouseMove={this._onMouseMove}
              onMouseUp={this._onMouseUp}
            >
              <DragSelectLayer />
              <DragPreviewLayer />
              <WiresLayer />
              <NodesLayer
                onNodeMouseDown={this._onNodeMouseDown}
                onNodeMouseOver={this._onNodeMouseOver}
                onNodeMouseLeave={this._onNodeMouseLeave}
                onNodePinMouseDown={this._onNodePinMouseDown}
                onNodePinMouseUp={this._onNodePinMouseUp}
              />
            </svg>
          </div>
        </HotKeys>
      </FieldContainer>
    );
  }

  private _keyHandlers: KeymapHandler = {
    [KEYMAP_SIM_STEP]: () => this.props.onHotkeyStep(),
    [KEYMAP_SIM_FASTFORWARD]: () => this.props.onHotkeyFastForward(),
    [KEYMAP_NODE_COPY]: () => this.props.onHotkeyCopy(),
    [KEYMAP_NODE_PASTE]: () => this.props.onHotkeyPaste(),
    [KEYMAP_NODE_DELETE]: () => this.props.onHotkeyDelete()
  };

  private _onNodeMouseOver(nodeId: string, e: React.MouseEvent) {
    if (e.defaultPrevented) {
      return;
    }

    this.props.onNodeHover(nodeId);
  }

  private _onNodeMouseLeave(nodeId: string, e: React.MouseEvent) {
    this.props.onNodeHover(null);
  }

  private _onNodeMouseDown(nodeId: string, e: React.MouseEvent) {
    if (e.defaultPrevented) {
      return;
    }

    this._mouseDownNodeId = nodeId;
  }

  private _onNodePinMouseDown(
    nodeId: string,
    pinId: string,
    e: React.MouseEvent
  ) {
    if (e.defaultPrevented) {
      return;
    }
    this._mouseDownNodeId = nodeId;
    this._mouseDownPinId = pinId;
    e.preventDefault();
  }

  private _onNodePinMouseUp(nodeId: string, pinId: string, e: React.MouseEvent) {
    if (this._isDragging) {
      return;
    }

    if (e.defaultPrevented) {
      this._resetMouseTracking();
      return;
    }

    if (this._mouseDownNodeId !== nodeId || this._mouseDownPinId !== pinId) {
      this._resetMouseTracking();
      return;
    }

    const { onNodePinClicked } = this.props;
    onNodePinClicked(nodeId, pinId);
    this._resetMouseTracking();
    e.preventDefault();
  }

  private _onMouseDown(e: React.MouseEvent) {
    if (e.defaultPrevented) {
      return;
    }

    if (this._hotkeysRef.current) {
      this._hotkeysRef.current.focus();
    }

    if (!this._svgRef.current) {
      return;
    }

    const p = getFieldCoord(this._svgRef.current, { x: e.clientX, y: e.clientY });

    this._startMousePos = p;
  }

  private _onMouseMove(e: React.MouseEvent) {
    if (e.defaultPrevented) {
      return;
    }

    if (!this._startMousePos) {
      return;
    }

    if (!this._svgRef.current) {
      return;
    }

    const { x: sx, y: sy } = this._startMousePos;

    const { ctrlKey, altKey, shiftKey, metaKey } = e;
    const { x, y } = getFieldCoord(this._svgRef.current, { x: e.clientX, y: e.clientY });

    const modifiers = {
      ctrlMetaKey: keyboardIsMac ? metaKey : ctrlKey,
      altKey: altKey,
      shiftKey
    };

    if (!this._isDragging) {
      if (
        Math.abs(x - sx) < DRAG_THRESHOLD &&
        Math.abs(y - sy) < DRAG_THRESHOLD
      ) {
        return;
      }

      this._isDragging = true;
      if (this._mouseDownNodeId) {
        this.props.onNodeDragStart(this._mouseDownNodeId, { x, y }, modifiers);
      } else {
        this.props.onFieldDragStart({ x, y });
      }
    } else {
      this.props.onDragMove({ x, y });
    }
  }

  private _onMouseUp(e: React.MouseEvent) {
    if (e.defaultPrevented) {
      this._resetMouseTracking();
      return;
    }

    if (!this._svgRef.current) {
      return;
    }

    const { ctrlKey, altKey, metaKey, shiftKey } = e;
    const { x, y } = getFieldCoord(this._svgRef.current, { x: e.clientX, y: e.clientY });

    const modifiers = {
      ctrlMetaKey: keyboardIsMac ? metaKey : ctrlKey,
      altKey: altKey,
      shiftKey
    };

    if (this._isDragging) {
      this.props.onDragEnd({ x, y }, modifiers);
    } else if (this._mouseDownNodeId) {
      this.props.onNodeClicked(this._mouseDownNodeId, modifiers);
    } else {
      this.props.onFieldClicked(modifiers);
    }

    this._resetMouseTracking();
  }

  private _resetMouseTracking() {
    this._isDragging = false;
    this._mouseDownNodeId = null;
    this._mouseDownPinId = null;
    this._startMousePos = null;
  }
}

export default sizeme({
  monitorWidth: true,
  monitorHeight: true,
  noPlaceholder: true
})(connect(null, mapDispatchToProps)(CircuitField));
