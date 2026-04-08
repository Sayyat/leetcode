const DOT = ".";
const STAR = "*";

type TRange = {
  min: number;
  max: number;
};

type TExpression = {
  letter: string;
  count: TRange | number | "*" | "?" | "+";
};

type TMatchTree = {
  match: string;
  expression: TExpression;
  children: TMatchTree[];
};

function printMatchTree(tree: TMatchTree[], level = 0) {
  for (const node of tree) {
    console.log("  ".repeat(level) + `- ${node.match}`);
    printMatchTree(node.children, level + 1);
  }
}

function pattern2expressionList(p: string): TExpression[] {
  // make sure p[0] is not *
  let expressions: TExpression[] = [];

  for (let i = 0; i < p.length; i++) {
    if (p[i] === STAR) {
      expressions[expressions.length - 1].count = "*";
    } else {
      expressions.push({
        letter: p[i],
        count: 1,
      });
    }
  }

  return expressions;
}

function isChunkMatch(chunk: string, expression: TExpression): boolean {
  let matchCount = 0;

  for (let i = 0; i < chunk.length; i++) {
    if (expression.letter === DOT || chunk[i] === expression.letter) {
      matchCount++;
    } else {
      return false;
    }
  }
  console.log({
    chunk,
    expression: expression.letter + expression.count,
    matchCount,
  });

  if (expression.count === "*") {
    return true;
  } else if (typeof expression.count === "number") {
    return matchCount === expression.count;
  } else {
    return false;
  }
}

function buildMatchTree(
  text: string,
  expressions: TExpression[],
  level = 0
): TMatchTree[] {
  console.log({level});
  
  if (expressions.length === 0) return [];
  if (text.length === 0) return [];

  const firstExpression = expressions[0];
  if (!isChunkMatch(text.slice(0, 1), firstExpression)) return [];

  if (firstExpression.letter !== STAR) {
    const nextText = text.slice(1);
    const nextExpressions = expressions.slice(1);
    const childMatchTree = buildMatchTree(nextText, nextExpressions, level + 1);
    return [
      {
        match: text.slice(0, 1),
        expression: firstExpression,
        children: childMatchTree,
      },
    ];
  }

  let matchTree: TMatchTree[] = [];

  let t = 0;
  let e = 0;

  while (t < text.length && isChunkMatch(text.slice(0, t), expressions[e])) {
    const nextText = text.slice(t + 1);
    const nextExpressions = expressions.slice(e + 1);
    const childMatchTree = [
      ...buildMatchTree(text, nextExpressions, level + 1),
      ...buildMatchTree(nextText, expressions, level + 1),
    ];
    matchTree.push({
      match: text.slice(0, t),
      expression: expressions[e],
      children: childMatchTree,
    });
    t++;
  }

  return matchTree;
}

function isMatch(s: string, p: string): boolean {
  console.log(JSON.stringify({ s, p }, null, 2));
  if (p === STAR) return false;
  const expressions = pattern2expressionList(p);
  console.log("expressions");
  console.log(JSON.stringify(expressions, null, 2));
  const matchTrees = buildMatchTree(s, expressions);
  console.log("\nmatchTrees");
  console.log(JSON.stringify(matchTrees, null, 2));
  printMatchTree(matchTrees);
  return false;
}

// console.log(isMatch("aa", "a"));
// console.log(isMatch("aa", "a*"));
// console.log(isMatch("ab", ".*"));
console.log(isMatch("aab", "a*b"));
// console.log(isMatch("mississippi", "mis*is*p*."));

// console.log(isChunkMatch("", { letter: "a", count: 1 }));
// console.log(isChunkMatch("a", { letter: "a", count: 1 }));
// console.log(isChunkMatch("", { letter: "a", count: "*" }));
// console.log(isChunkMatch("a", { letter: "a", count: "*" }));
// console.log(isChunkMatch("aa", { letter: "a", count: "*" }));
// console.log(isChunkMatch("aaa", { letter: "a", count: "*" }));
// console.log(isChunkMatch("a", { letter: "a", count: 2 }));
// console.log(isChunkMatch("aa", { letter: "a", count: 2 }));
// console.log(isChunkMatch("aaa", { letter: "a", count: 2 }));
