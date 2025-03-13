module.exports = function (babel) {
    const { types: t } = babel;

    return {
        visitor: {
            ImportDeclaration(path, state) {
                // 只处理 prismjs 相关组件的导入
                if (path.node.source.value.startsWith('prismjs/components/prism-')) {
                    const isESM = state.opts.isESM;
                    const importPath = path.node.source.value;

                    if (isESM) {
                        // 创建 IIFE async 函数
                        const iife = t.expressionStatement(
                            t.callExpression(
                                t.arrowFunctionExpression(
                                    [],
                                    t.blockStatement([
                                        t.ifStatement(
                                            t.logicalExpression(
                                                '&&',
                                                t.binaryExpression(
                                                    '!==',
                                                    t.unaryExpression('typeof', t.identifier('window')),
                                                    t.stringLiteral('undefined')
                                                ),
                                                t.binaryExpression(
                                                    '!==',
                                                    t.unaryExpression('typeof', t.memberExpression(t.identifier('window'), t.identifier('Prism'))),
                                                    t.stringLiteral('undefined')
                                                )
                                            ),
                                            t.blockStatement([
                                                t.expressionStatement(
                                                    t.awaitExpression(
                                                        t.callExpression(
                                                            t.import(),
                                                            [t.stringLiteral(importPath)]
                                                        )
                                                    )
                                                )
                                            ])
                                        )
                                    ]),
                                    true  // async
                                ),
                                []
                            )
                        );

                        path.replaceWith(iife);
                    }
                }
            }
        }
    };
};