import * as React from "react";

import ReactMarkdown from "react-markdown";

import styled from "styled-components";

import readmeContent from "@/../README.md";

export interface IntroProps {
  dismiss(): void;
}
type Props = IntroProps;
export default class IntroPage extends React.Component<Props> {
  render() {
    const {
      dismiss
    } = this.props;
    return (
      <IntroContainer>
        <IntroContent>
          <HeaderContainer>
            <h3>
              <b>UNDER CONSTRUCTION</b>
              <p>https://github.com/RoboPhred/discrelog</p>
              <p>
                This is an as-yet-unfinished experiment.  The user interface is frustrating at best,
                and you cannot save your work.  It is made available as a playground for the
                current state of the project.
              </p>
            </h3>
          </HeaderContainer>
          <MarkdownContainer>
            <ReactMarkdown source={readmeContent}/>
          </MarkdownContainer>
          <DismissButton onClick={dismiss}>Let me break things</DismissButton>
        </IntroContent>
      </IntroContainer>
    );
  }
}

const IntroContainer = styled.div`
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 25px;
  z-index: 9999;
`;

const IntroContent = styled.div`
  box-sizing: border-box;
  border: 1px solid #888;
  width: 100%;
  height: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  flex: 0 1 auto;
`;

const MarkdownContainer = styled.div`
  flex: 0 1 auto;
  overflow-y: scroll;
  background: lightgray;
  margin: 5px;
  padding: 5px;
`;

const DismissButton = styled.button`
  height: 30px;
`