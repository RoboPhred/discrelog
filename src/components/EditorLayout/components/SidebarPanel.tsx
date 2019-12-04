import styled from "styled-components";

export interface SidebarPanelProps {
  width?: number;
  height?: number;
}
const SidebarPanel = styled("div") <SidebarPanelProps>`
  flex: none;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: lightgrey;
  border: 1 solid darkgray;
  width: ${props => (props.width != null ? `${props.width}px` : undefined)};
  height: ${props => (props.height != null ? `${props.height}px` : undefined)};
`;
export default SidebarPanel;
