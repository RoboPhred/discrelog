import * as React from "react";

import { createStructuredSelector } from "reselect";

import styled from "styled-components";

import { connect } from "react-redux";

import { Stage, Layer, Rect } from "react-konva";

import sizeme, { SizeProps } from "react-sizeme";

import { normalizeRectangle, calcSize } from "@/geometry";
import { Position } from "@/types";
import { AppState } from "@/store";

import {
  moveSelected,
  clearSelection,
  selectNode,
  selectRegion,
  mouseOverNode
} from "@/pages/CircuitEditor/actions";

import { selectedNodes } from "@/pages/CircuitEditor/selectors";

import { interactNode } from "@/services/simulator/actions";

import WiresLayer from "./components/WiresLayer";
import NodesLayer from "./components/NodesLayer";

export interface CircuitFieldProps {
  className?: string;
}

const CircuitFieldContainer = styled.div`
  overflow: hidden;
`;

interface StateProps {
  selectedNodes: ReturnType<typeof selectedNodes>;
}
const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  selectedNodes
});

const mapDispatchToProps = {
  interactNode,
  mouseOverNode,
  moveSelected,
  selectNode,
  selectRegion,
  clearSelection
};
type DispatchProps = typeof mapDispatchToProps;

type Props = CircuitFieldProps & SizeProps & StateProps & DispatchProps;
interface State {
  mouseDownNodeId: string | null;
  isDragging: boolean;
  dragStart: Position | null;
  dragEnd: Position | null;
}
class CircuitField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      mouseDownNodeId: null,
      isDragging: false,
      dragStart: null,
      dragEnd: null
    };

    this._onNodeMouseDown = this._onNodeMouseDown.bind(this);
    this._onNodeMouseOver = this._onNodeMouseOver.bind(this);
    this._onNodeMouseLeave = this._onNodeMouseLeave.bind(this);

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
  }

  render() {
    const {
      className,
      size: { width, height }
    } = this.props;
    const { dragStart, dragEnd } = this.state;

    return (
      <CircuitFieldContainer className={className}>
        <Stage
          width={width}
          height={height}
          onMouseDown={this._onMouseDown}
          onMouseMove={this._onMouseMove}
          onMouseUp={this._onMouseUp}
        >
          {dragStart &&
            dragEnd && (
              <Layer>
                <Rect
                  x={Math.min(dragStart.x, dragEnd.x)}
                  y={Math.min(dragStart.y, dragEnd.y)}
                  width={Math.abs(dragEnd.x - dragStart.x)}
                  height={Math.abs(dragEnd.y - dragStart.y)}
                  fill="blue"
                />
              </Layer>
            )}
          <WiresLayer />
          <NodesLayer
            onNodeMouseDown={this._onNodeMouseDown}
            onNodeMouseOver={this._onNodeMouseOver}
            onNodeMouseLeave={this._onNodeMouseLeave}
          />
        </Stage>
      </CircuitFieldContainer>
    );
  }

  private _onNodeMouseDown(nodeId: string, e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      return;
    }

    // Claim it so we do not start drag-selecting.
    e.evt.preventDefault();

    this.setState({
      mouseDownNodeId: nodeId
    });
  }

  private _onNodeMouseOver(nodeId: string, e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      return;
    }

    this.props.mouseOverNode(nodeId);
  }

  private _onNodeMouseLeave(nodeId: string, e: KonvaMouseEvent) {
    this.props.mouseOverNode(null);
  }

  private _onMouseDown(e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      return;
    }

    this.setState({
      dragStart: {
        x: e.evt.layerX,
        y: e.evt.layerY
      }
    });
  }

  private _onMouseMove(e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      return;
    }

    // TODO: Selection and drag logic should all be in the ui reducer.

    const { mouseDownNodeId, dragStart } = this.state;

    if (mouseDownNodeId) {
      // Dragging a node.
      // Make sure node is selected.
      if (this.props.selectedNodes.indexOf(mouseDownNodeId) === -1) {
        // Not selected, add or set the selection.
        const append = e.evt.shiftKey || e.evt.ctrlKey;
        this.props.selectNode(mouseDownNodeId, { append });
      }
      // Move things around.
      this.props.moveSelected(e.evt.movementX, e.evt.movementY);
      e.evt.preventDefault();
      this.setState({
        isDragging: true
      });
      return;
    }

    if (!dragStart) {
      return;
    }

    e.evt.preventDefault();

    let dragEnd = this.state.dragEnd;
    if (!dragEnd) {
      dragEnd = {
        x: e.evt.layerX,
        y: e.evt.layerY
      };

      // Not dragging until we hit the thresh.
      const r = normalizeRectangle(dragStart, dragEnd);
      const s = calcSize(r);
      if (s.width < 5 || s.height < 5) {
        return;
      }
    }

    this.setState({
      isDragging: true,
      dragEnd: {
        x: e.evt.layerX,
        y: e.evt.layerY
      }
    });
  }

  private _onMouseUp(e: KonvaMouseEvent) {
    const { mouseDownNodeId, isDragging, dragStart, dragEnd } = this.state;
    this.setState({
      mouseDownNodeId: null,
      isDragging: false,
      dragStart: null,
      dragEnd: null
    });

    if (!isDragging) {
      if (mouseDownNodeId) {
        if (e.evt.altKey || e.evt.metaKey) {
          // Click on node
          //  TODO: just use click; suppress with preventDefault if drag start.
          this.props.interactNode(mouseDownNodeId);
        } else {
          const append = e.evt.ctrlKey || e.evt.shiftKey;
          this.props.selectNode(mouseDownNodeId, { append });
        }
      } else {
        this.props.clearSelection();
      }
      e.evt.preventDefault();
      return;
    }

    if (!dragStart || !dragEnd) {
      return;
    }

    e.evt.preventDefault();
    this.props.selectRegion({ p1: dragStart, p2: dragEnd });
  }
}

export default sizeme({
  monitorWidth: true,
  monitorHeight: true,
  noPlaceholder: true
})(connect(mapStateToProps, mapDispatchToProps)(CircuitField));
