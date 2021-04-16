import { AppState } from "@/store";
import { evolverIdFromElementIdSelector } from "../simulator-graph/selectors/elements";

import { valueExpressionTokensToAst } from "./ast/parser";
import { ValueExpressionAst, ValueExpressionAstElementPin } from "./ast/types";
import { tokenizeValueExpression } from "./tokens/parser";

export function getValueExpressionResult(
  expression: string,
  state: AppState
): boolean {
  const tokens = tokenizeValueExpression(expression);
  const ast = valueExpressionTokensToAst(tokens);
  if (!ast) {
    return false;
  }

  return evaluateAst(ast, state);
}

function evaluateAst(ast: ValueExpressionAst, state: AppState): boolean {
  switch (ast.type) {
    case "element-pin":
      return evaluateAstElementPin(ast, state);
    case "unary-operator": {
      switch (ast.operator) {
        case "!":
          return !evaluateAst(ast.value, state);
        default:
          throw new Error(
            `Unknown value expression operator "${ast.operator}".`
          );
      }
    }
    case "binary-operator": {
      switch (ast.operator) {
        case "&&":
          return evaluateAst(ast.left, state) && evaluateAst(ast.right, state);
        case "||":
          return evaluateAst(ast.left, state) || evaluateAst(ast.right, state);
        default:
          throw new Error(
            `Unknown value expression operator "${ast.operator}".`
          );
      }
    }
  }
}

function evaluateAstElementPin(
  elementPin: ValueExpressionAstElementPin,
  state: AppState
): boolean {}
