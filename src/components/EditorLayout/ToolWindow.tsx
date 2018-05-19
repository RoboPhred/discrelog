import * as React from "react";

import styled from "styled-components";

const FlexItem = styled.div`
  box-sizing: border-box;
  flex: none;
  padding: 5px;
`;

class ToolWindow extends React.Component {
  render() {
    return <FlexItem>{this.props.children}</FlexItem>;
  }
}
export default ToolWindow;
