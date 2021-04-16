import { ValueExpressionParseError } from "../errors";
import { ValueExpressionToken } from "../tokens/types";
import {
  ValueExpressionAst,
  ValueExpressionAstElementPin,
  ValueExpressionAstBinaryOperator,
  ValueExpressionAstUnaryOperator,
} from "./types";

export function valueExpressionTokensToAst(
  tokens: ValueExpressionToken[]
): ValueExpressionAst | null {
  const tokenStack = [...tokens];
  return parseTokens(tokenStack);
}

function parseTokens(
  tokens: ValueExpressionToken[],
  expectParenClose = false
): ValueExpressionAst | null {
  let astNode: ValueExpressionAst | null = null;
  let token: ValueExpressionToken | undefined;
  while ((token = tokens[0])) {
    if (!token) {
      break;
    }
    switch (token.type) {
      case "named-object":
        astNode = parseNamedObject(astNode, tokens);
        break;
      case "operator":
        astNode = parseOperator(astNode, tokens);
      case "parenthesis-close":
        if (!expectParenClose) {
          throw new ValueExpressionParseError(
            token.textOffset,
            `Unexpected closing parenthesis.`
          );
        }
        tokens.pop();
        return astNode;
      case "parenthesis-open":
        astNode = parseTokens(tokens, true);
      default:
        throw new ValueExpressionParseError(token.textOffset, "Syntax error.");
    }
  }

  return astNode;
}

function parseNamedObject(
  currentAst: ValueExpressionAst | null,
  tokenStack: ValueExpressionToken[]
): ValueExpressionAstElementPin {
  const namedObject = tokenStack.pop();
  if (!namedObject || namedObject.type !== "named-object") {
    throw new Error(
      "Token stack must include a named object token at the top of the stack."
    );
  }

  const path: string[] = [namedObject.name];
  let pin: string | null = null;

  let nextToken: ValueExpressionToken | undefined;
  parseNameLoop: while ((nextToken = tokenStack[0])) {
    if (!nextToken) {
      break;
    }

    switch (nextToken.type) {
      case "element-path-join": {
        tokenStack.pop();
        const nextName = parseOneName(tokenStack);
        if (!nextName) {
          throw new ValueExpressionParseError(
            nextToken.textOffset,
            "Expected an element name."
          );
        }
        path.push(nextName);
        break;
      }
      case "element-pin-join": {
        tokenStack.pop();
        const nextName = parseOneName(tokenStack);
        if (!nextName) {
          throw new ValueExpressionParseError(
            nextToken.textOffset,
            "Expected a pin name."
          );
        }
        pin = nextName;
        break parseNameLoop;
      }
      default:
        break parseNameLoop;
    }
  }

  if (!pin) {
    throw new ValueExpressionParseError(
      namedObject.textOffset,
      "A pin must be supplied."
    );
  }

  return {
    type: "element-pin",
    path,
    pin,
  };
}

function parseOneName(tokenStack: ValueExpressionToken[]): string | null {
  const namedObject = tokenStack.pop();
  if (!namedObject || namedObject.type !== "named-object") {
    return null;
  }

  return namedObject.name;
}

function parseOperator(
  currentAst: ValueExpressionAst | null,
  tokenStack: ValueExpressionToken[]
): ValueExpressionAstBinaryOperator | ValueExpressionAstUnaryOperator {
  const operatorToken = tokenStack.pop();
  if (!operatorToken || operatorToken.type !== "operator") {
    throw new Error(
      "Token stack must include an operator token at the top of the stack."
    );
  }

  const right = parseTokens(tokenStack);
  if (!right) {
    throw new ValueExpressionParseError(
      operatorToken.textOffset,
      `Expected expression after "${operatorToken.operator}".`
    );
  }

  switch (operatorToken.operator) {
    case "!":
      return {
        type: "unary-operator",
        operator: operatorToken.operator,
        value: right,
      };
    case "&&":
    case "||":
      if (!currentAst) {
        throw new ValueExpressionParseError(
          operatorToken.textOffset,
          `Expected expression before "${operatorToken.operator}".`
        );
      }
      return {
        type: "binary-operator",
        operator: operatorToken.operator,
        left: currentAst,
        right,
      };
  }

  throw new Error(
    `Unknown value expression operator "${operatorToken.operator}".`
  );
}
