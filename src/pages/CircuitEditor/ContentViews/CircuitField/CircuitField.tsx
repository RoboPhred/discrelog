import * as React from "react";

import { connect } from "react-redux";

import { Stage } from "react-konva";
import sizeme, { SizeProps } from "react-sizeme";
import { HotKeys, FocusTrap } from "react-hotkeys";

import { Position } from "@/types";
import { bindFuncMap } from "@/utils";

import keymap, { KeymapHandler, KEYMAP_STEPSIM } from "./keymap";

import FieldContainer from "./components/FieldContainer";
import DragPreviewLayer from "./components/DragPreviewLayer";
import DragSelectLayer from "./components/DragSelectLayer";
import WiresLayer from "./components/WiresLayer";
import NodesLayer from "./components/NodesLayer";

import * as events from "./events";
import { keyboardIsMac } from "@/runtime-env";

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
  private _startMousePos: Position | null = null;
  private _lastMousePos: Position | null = null;

  private _hotkeysRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);

    this._onNodeMouseDown = this._onNodeMouseDown.bind(this);
    this._onNodeMouseOver = this._onNodeMouseOver.bind(this);
    this._onNodeMouseLeave = this._onNodeMouseLeave.bind(this);

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
            <Stage
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
              />
            </Stage>
          </div>
        </HotKeys>
      </FieldContainer>
    );
  }

  private _keyHandlers: KeymapHandler = {
    [KEYMAP_STEPSIM]: () => this.props.onHotkeyStep()
  };

  private _onNodeMouseOver(nodeId: string, e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      return;
    }

    this.props.onNodeHover(nodeId);
  }

  private _onNodeMouseLeave(nodeId: string, e: KonvaMouseEvent) {
    this.props.onNodeHover(null);
  }

  private _onNodeMouseDown(nodeId: string, e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      return;
    }

    this._mouseDownNodeId = nodeId;
  }

  private _onMouseDown(e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      return;
    }

    if (this._hotkeysRef.current) {
      this._hotkeysRef.current.focus();
    }

    this._startMousePos = {
      x: e.evt.layerX,
      y: e.evt.layerY
    };
  }

  private _onMouseMove(e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      return;
    }

    if (!this._startMousePos) {
      return;
    }

    const { x: sx, y: sy } = this._startMousePos;

    const { layerX: x, layerY: y, ctrlKey, altKey, shiftKey, metaKey } = e.evt;
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

  private _onMouseUp(e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      this._resetMouseTracking();
      return;
    }

    const { layerX: x, layerY: y, ctrlKey, altKey, metaKey, shiftKey } = e.evt;
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
    this._startMousePos = null;
    this._lastMousePos = null;
  }
}

export default sizeme({
  monitorWidth: true,
  monitorHeight: true,
  noPlaceholder: true
})(connect(null, mapDispatchToProps)(CircuitField));
