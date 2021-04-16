export interface BreakpointExpressionTokenNamedObject {
  type: "named-object";
  name: string;
}

export interface BreakpointExpressionTokenElementPinJoin {
  type: "element-pin-join";
}

export interface BreakpointExpressionOperator {
  type: "operator";
  operator: string;
}

export interface BreakpointExpressionParenthesisOpen {
  type: "parenthesis-open";
}

export interface BreakpointExpressionParenthesisClose {
  type: "parenthesis-close";
}

export type BreakpointExpressionToken =
  | BreakpointExpressionTokenNamedObject
  | BreakpointExpressionTokenElementPinJoin
  | BreakpointExpressionOperator
  | BreakpointExpressionParenthesisOpen
  | BreakpointExpressionParenthesisClose;
