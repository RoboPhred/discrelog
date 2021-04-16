/**
 * ex: "[foo]"
 */
export interface BreakpointExpressionAstNamedObject {
  type: "named-object";
  name: string;
}

/**
 * ex: [foo]:[bar]
 */
export interface BreakpointExpressionAstElementPinPair {
  type: "element-pin";
  node: BreakpointExpressionAstNamedObject;
  pin: BreakpointExpressionAstNamedObject;
}

/**
 * ex: [foo] && [bar]
 */
export interface BreakpointExpressionAstAnd {
  type: "and";
  left: BreakpointExpressionAst;
  right: BreakpointExpressionAst;
}

/**
 * ex: [foo] || [bar]
 */
export interface BreakpointExpressionOr {
  type: "or";
  left: BreakpointExpressionAst;
  right: BreakpointExpressionAst;
}

export type BreakpointExpressionAst =
  | BreakpointExpressionAstNamedObject
  | BreakpointExpressionAstElementPinPair
  | BreakpointExpressionAstAnd;
