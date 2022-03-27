export const xpathEval = (expression, node) => {
    return document.evaluate(expression, node, null, XPathResult.ANY_TYPE, null)
}