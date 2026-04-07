const DOT = "."
const STAR = "*"

type TRange = {
    min: number,
    max: number
}

type TExpression = {
    letter: string
    count: TRange | number | "*" | "?" | "+"
}

function pattern2ExpressionList(p: string): TExpression[]{
    // make sure p[0] is not *
    let expressions: TExpression[] = []

    for (let i = 0; i < p.length; i++) {
        if (p[i] === STAR) {
            expressions[expressions.length - 1].count = "*"
        } else {
            expressions.push({
                letter: p[i],
                count: 1
            })
        }
    }

    return expressions
}




function isMatch(s: string, p: string): boolean {
    if (p === STAR) return false
    const expressions = pattern2ExpressionList(p)

    for (let i = 0; i < expressions.length; i++){
        
    }

    return true

};


console.log(isMatch("aa", "a"))
console.log(isMatch("aa", "a*"))
console.log(isMatch("ab", ".*"))
console.log(isMatch("aab", "c*a*b"))
console.log(isMatch("mississippi", "mis*is*p*."))
