run: 43118154670
commit: c603fde20d653930e28d3d5074e8f8d31bb020a0

```
Using src/app as the root directory for Expo Router.
SyntaxError: /home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/metro.config.js: Unexpected token, expected ")" (73:6)

[0m [90m 71 |[39m     [90m// no-op proxy instead of chasing which native dependency leaks it.[39m
 [90m 72 |[39m     [36mif[39m ([33m/[39m[33m^[39mreact[33m-[39mnative[35m/(Libraries|src)/[39m[33m/[39m[33m.[39mtest(moduleName)) {
[31m[1m>[22m[39m[90m 73 |[39m       [36mreturn[39m {
 [90m    |[39m       [31m[1m^[22m[39m
 [90m 74 |[39m         type[33m:[39m [32m'sourceFile'[39m[33m,[39m
 [90m 75 |[39m         filePath[33m:[39m path[33m.[39mjoin(__dirname[33m,[39m [32m'src/web-shims'[39m[33m,[39m [32m'rn-internal.web.js'[39m)[33m,[39m
 [90m 76 |[39m       }[33m;[39m[0m
SyntaxError: /home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/metro.config.js: Unexpected token, expected ")" (73:6)

[0m [90m 71 |[39m     [90m// no-op proxy instead of chasing which native dependency leaks it.[39m
 [90m 72 |[39m     [36mif[39m ([33m/[39m[33m^[39mreact[33m-[39mnative[35m/(Libraries|src)/[39m[33m/[39m[33m.[39mtest(moduleName)) {
[31m[1m>[22m[39m[90m 73 |[39m       [36mreturn[39m {
 [90m    |[39m       [31m[1m^[22m[39m
 [90m 74 |[39m         type[33m:[39m [32m'sourceFile'[39m[33m,[39m
 [90m 75 |[39m         filePath[33m:[39m path[33m.[39mjoin(__dirname[33m,[39m [32m'src/web-shims'[39m[33m,[39m [32m'rn-internal.web.js'[39m)[33m,[39m
 [90m 76 |[39m       }[33m;[39m[0m
    at toParseError (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parse-error.ts:95:45)
    at Parser.raise (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/tokenizer/index.ts:1504:19)
    at Parser.unexpected (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/tokenizer/index.ts:1544:16)
    at Parser.expect (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/util.ts:157:12)
    at Parser.parseHeaderExpression (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:923:10)
    at Parser.parseIfStatement (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:1091:22)
    at Parser.parseStatementContent (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:541:21)
    at Parser.parseStatementLike (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:482:17)
    at Parser.parseStatementListItem (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:431:17)
    at Parser.parseBlockOrModuleBlockBody (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:1444:16)
    at Parser.parseBlockBody (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:1417:10)
    at Parser.parseBlock (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:1385:10)
    at Parser.parseStatementContent (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:622:21)
    at Parser.parseStatementLike (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:482:17)
    at Parser.parseStatementOrSloppyAnnexBFunctionDeclaration (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:451:17)
    at Parser.parseIfStatement (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:1094:28)
    at Parser.parseStatementContent (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:541:21)
    at Parser.parseStatementLike (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:482:17)
    at Parser.parseStatementListItem (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:431:17)
    at Parser.parseBlockOrModuleBlockBody (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:1444:16)
    at Parser.parseBlockBody (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:1417:10)
    at Parser.parseBlock (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:1385:10)
    at Parser.parseFunctionBody (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:2621:24)
    at Parser.parseArrowExpression (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:2562:10)
    at Parser.parseParenAndDistinguishExpression (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:1850:12)
    at Parser.parseExprAtom (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:1170:21)
    at Parser.parseExprSubscripts (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:742:23)
    at Parser.parseUpdate (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:721:21)
    at Parser.parseMaybeUnary (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:683:23)
    at Parser.parseMaybeUnaryOrPrivate (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:417:14)
    at Parser.parseExprOps (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:429:23)
    at Parser.parseMaybeConditional (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:384:23)
    at Parser.parseMaybeAssign (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:301:21)
    at Parser.parseMaybeAssign (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:345:25)
    at Parser.parseExpressionBase (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:226:23)
    at callback (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:217:39)
    at Parser.allowInAnd (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:3192:16)
    at Parser.parseExpression (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/expression.ts:217:17)
    at Parser.parseStatementContent (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:688:23)
    at Parser.parseStatementLike (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:482:17)
    at Parser.parseModuleItem (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:419:17)
    at Parser.parseBlockOrModuleBlockBody (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:1443:16)
    at Parser.parseBlockBody (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:1417:10)
    at Parser.parseProgram (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:229:10)
    at Parser.parseTopLevel (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/statement.ts:203:25)
    at Parser.parse (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/parser/index.ts:83:25)
    at parse (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+parser@7.29.7/node_modules/@babel/parser/src/index.ts:86:38)
    at parser (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+core@7.29.7_supports-color@8.1.1/node_modules/@babel/core/src/parser/index.ts:29:19)
    at parser.next (<anonymous>)
    at normalizeFile (/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/@babel+core@7.29.7_supports-color@8.1.1/node_modules/@babel/core/src/transformation/normalize-file.ts:49:24)
```
