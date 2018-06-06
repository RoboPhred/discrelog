import * as React from "react";

import styled from "styled-components";

class ToolWindow extends React.Component {
  render() {
    return <ToolWindowDiv>{this.props.children}</ToolWindowDiv>;
  }
}
export default ToolWindow;

const ToolWindowDiv = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-height: 100%;
  flex: none;
  padding: 5px;
  overflow: auto;
`;
