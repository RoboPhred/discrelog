interface ValueExpressionTokenBase {
  textOffset: number;
}

export interface ValueExpressionTokenNamedObject
  extends ValueExpressionTokenBase {
  type: "named-object";
  name: string;
}

export interface ValueExpressionTokenElementPathJoin
  extends ValueExpressionTokenBase {
  type: "element-path-join";
}

export interface ValueExpressionTokenElementPinJoin
  extends ValueExpressionTokenBase {
  type: "element-pin-join";
}

export interface ValueExpressionTokenOperator extends ValueExpressionTokenBase {
  type: "operator";
  operator: string;
}

export interface ValueExpressionTokenParenthesisOpen
  extends ValueExpressionTokenBase {
  type: "parenthesis-open";
}

export interface ValueExpressionTokenParenthesisClose
  extends ValueExpressionTokenBase {
  type: "parenthesis-close";
}

export type ValueExpressionToken =
  | ValueExpressionTokenNamedObject
  | ValueExpressionTokenElementPinJoin
  | ValueExpressionTokenElementPathJoin
  | ValueExpressionTokenOperator
  | ValueExpressionTokenParenthesisOpen
  | ValueExpressionTokenParenthesisClose;
