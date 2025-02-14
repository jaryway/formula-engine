# GIT COMMIT MESSAGE CHEAT SHEET

**Proposed format of the commit message**

```
<type>(<scope>): <subject>

<body>
```

All lines are wrapped at 100 characters !

**Allowed `<type>`**


- feat: 类型 为 feat 的提交表示在代码库中新增了一个功能（这和语义化版本中的 MINOR 相对应）
- fix: 类型 为 fix 的提交表示在代码库中修复了一个 bug（这和语义化版本中的 PATCH 相对应）
- docs: 用于修改文档，例如修改 README 文件、API 文档等
- style: 用于修改代码的样式，例如调整缩进、空格、空行等
- perf: 用于优化性能，例如提升代码的性能、减少内存占用等
- refactor: 用于重构代码，例如修改代码结构、变量名、函数名等但不修改功能逻辑
- test: 用于修改测试用例，例如添加、删除、修改代码的测试用例等。
- build: 用于修改项目构建系统，例如修改依赖库、外部接口或者升级 Node 版本等
- ci: 用于修改持续集成流程，例如修改 Travis、Jenkins 等工作流配置
- chore: 用于对非业务性代码进行修改，例如修改构建流程或者工具配置等
- revert: (Reverts a previous commit)
- BREAKING CHANGE: 在脚注中包含 BREAKING CHANGE: 或 <类型>(范围) 后面有一个 ! 的提交，表示引入了破坏性 API 变更

- feat (A new feature)
- fix (A bug fix)
- docs (Documentation only changes)
- style (Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc))
- perf (A code change that improves performance)
- refactor (A code change that neither fixes a bug nor adds a feature)
- test (Adding missing tests or correcting existing tests)
- build (Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm))
- ci (Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs))
- chore (Other changes that don't modify src or test files)
- revert (Reverts a previous commit)



**Allowed `<scope>`**
Scope could be anything specifying place of the commit change.

For example $location, $browser, compiler, scope, ng:href, etc...


**Breaking changes**
All breaking changes have to be mentioned in message body, on separated line:
​	_Breaks removed $browser.setUrl() method (use $browser.url(newUrl))_
​	_Breaks ng: repeat option is no longer supported on selects (use ng:options)_


**Message body**

- uses the imperative, present tense: “change” not “changed” nor “changes”
- includes motivation for the change and contrasts with previous behavior