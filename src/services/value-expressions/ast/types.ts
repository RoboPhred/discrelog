export interface ValueExpressionAstElementPin {
  type: "element-pin";
  path: string[];
  pin: string;
}

export interface ValueExpressionAstBinaryOperator {
  type: "binary-operator";
  operator: string;
  left: ValueExpressionAst;
  right: ValueExpressionAst;
}

export interface ValueExpressionAstUnaryOperator {
  type: "unary-operator";
  operator: string;
  value: ValueExpressionAst;
}

export type ValueExpressionAst =
  | ValueExpressionAstElementPin
  | ValueExpressionAstBinaryOperator
  | ValueExpressionAstUnaryOperator;
