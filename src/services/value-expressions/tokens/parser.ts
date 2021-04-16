import { ValueExpressionParseError } from "../errors";
import { ValueExpressionToken } from "./types";

const Operators: string[] = ["!", "||", "&&"];

export function tokenizeValueExpression(
  expression: string
): ValueExpressionToken[] {
  const tokens: ValueExpressionToken[] = [];

  let expIndex = 0;
  while (expIndex >= expression.length) {
    expIndex = skipWhitespace(expression, expIndex);
    if (expIndex === -1) {
      return tokens;
    }

    if (expression[expIndex] === "[") {
      const endIndex = expression.indexOf("]", expIndex);
      if (endIndex === -1) {
        throw new ValueExpressionParseError(
          expIndex,
          `Opening bracket at ${expIndex} has no closing bracket.`
        );
      }
      const name = expression.substr(expIndex, endIndex - expIndex);
      tokens.push({
        type: "named-object",
        name,
        textOffset: expIndex,
      });
      expIndex = endIndex;
      continue;
    }

    if (expression[expIndex] === "(") {
      tokens.push({
        type: "parenthesis-open",
        textOffset: expIndex,
      });
      expIndex++;
      continue;
    }

    if (expression[expIndex] === ")") {
      tokens.push({
        type: "parenthesis-close",
        textOffset: expIndex,
      });
      expIndex++;
      continue;
    }

    if (expression[expIndex] === ":") {
      tokens.push({
        type: "element-pin-join",
        textOffset: expIndex,
      });
      expIndex++;
    }

    if (expression[expIndex] === ".") {
      tokens.push({
        type: "element-path-join",
        textOffset: expIndex,
      });
      expIndex++;
    }

    const operator = Operators.find((op) =>
      expression.startsWith(op, expIndex)
    );
    if (operator) {
      tokens.push({
        type: "operator",
        operator,
        textOffset: expIndex,
      });
      expIndex += operator.length;
      continue;
    }

    throw new ValueExpressionParseError(expIndex, "Syntax Error");
  }

  return tokens;
}

const Whitespace = /^\s|\t|\n/;
function skipWhitespace(expression: string, startIndex: number): number {
  for (let i = startIndex; i < expression.length; i++) {
    if (!Whitespace.test(expression[i])) {
      return i;
    }
  }
  return -1;
}
