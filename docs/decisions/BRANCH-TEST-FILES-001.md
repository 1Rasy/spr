# BRANCH-TEST-FILES-001：网页测试分支必须包含测试与进度文档

状态：已被新决策取代

取代日期：2026-07-14

取代文档：

- `docs/decisions/TEST-REPOSITORY-WORKFLOW-002.md`

## 仍然有效的原则

1. 用于网页验收的代码必须同时包含完整的 `tests/` 和对应 `docs` 记录。
2. 应用源码、测试文件和进度文档应位于同一个已验证提交。
3. 不能只发布页面代码而遗漏测试或进度说明。

## 已停止使用的旧流程

以下流程不再使用：

- 同时维护 `feat/stock-adjustment-phase-c` 和 `stock-adjustment-phase-c`；
- 要求两个分支始终指向同一个提交；
- 通过 PR 分支向不查看代码的用户交付网页验收版本。

后续统一使用：

- 测试仓库：`1Rasy/mdlztest`
- 测试分支：`main`
- 用户通过测试网页实际操作验收
- 验收通过后，再把已确认提交同步回 `1Rasy/spr/main`

旧分支和 PR #3 只保留历史记录，不再作为后续开发流程的一部分。完整规则以 `TEST-REPOSITORY-WORKFLOW-002.md` 为准。
