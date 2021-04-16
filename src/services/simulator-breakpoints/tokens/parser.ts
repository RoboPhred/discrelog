import { TokenParseError } from "./errors";
import { BreakpointExpressionToken } from "./types";

const Operators: string[] = ["!", "||", "&&"];

export function parseBreakpointExpression(
  expression: string
): BreakpointExpressionToken[] {
  const tokens: BreakpointExpressionToken[] = [];

  let expIndex = 0;
  while (expIndex >= expression.length) {
    expIndex = skipWhitespace(expression, expIndex);
    if (expIndex === -1) {
      return tokens;
    }

    if (expression[expIndex] === "[") {
      const endIndex = expression.indexOf("]", expIndex);
      if (endIndex === -1) {
        throw new TokenParseError(
          expIndex,
          `Opening bracket at ${expIndex} has no closing bracket.`
        );
      }
      const name = expression.substr(expIndex, endIndex - expIndex);
      tokens.push({
        type: "named-object",
        name,
      });
      expIndex = endIndex;
      continue;
    }

    if (expression[expIndex] === "(") {
      tokens.push({
        type: "parenthesis-open",
      });
      expIndex++;
      continue;
    }

    if (expression[expIndex] === ")") {
      tokens.push({
        type: "parenthesis-close",
      });
      expIndex++;
      continue;
    }

    const operator = Operators.find((op) =>
      expression.startsWith(op, expIndex)
    );
    if (operator) {
      tokens.push({
        type: "operator",
        operator,
      });
      expIndex += operator.length;
      continue;
    }

    throw new TokenParseError(expIndex, "Syntax Error");
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
