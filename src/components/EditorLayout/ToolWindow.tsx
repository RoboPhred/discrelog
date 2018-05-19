import * as React from "react";

import styled from "styled-components";

const ToolWindowDiv = styled.div`
  box-sizing: border-box;
  flex: none;
  padding: 5px;
  overflow: auto;
`;

class ToolWindow extends React.Component {
  render() {
    return <ToolWindowDiv>{this.props.children}</ToolWindowDiv>;
  }
}
export default ToolWindow;
