# TEST-REPOSITORY-WORKFLOW-002：使用独立测试仓库进行网页验收

状态：已确认

确认日期：2026-07-14

## 决策

1. 正式代码仓库继续使用 `1Rasy/spr`。
2. 新功能的网页测试仓库使用 `1Rasy/mdlztest`。
3. `mdlztest` 只使用默认分支 `main`，不再为了网页验收额外维护 `feat/*`、`stock-adjustment-*` 或 PR 分支。
4. 后续 AI 开发新功能时，优先直接修改并提交到 `1Rasy/mdlztest` 的 `main` 分支。
5. 用户只通过 `mdlztest` 对应的测试网页实际操作和验收，不需要查看代码、分支或 PR。
6. 用户确认功能可用后，再把已经验收的提交同步回 `1Rasy/spr` 的 `main` 分支。
7. 用户未确认前，不把测试仓库中的新功能自动同步到正式仓库。
8. 旧的 `feat/stock-adjustment-phase-c`、`stock-adjustment-phase-c` 和 PR #3 只保留为历史记录，不再作为后续开发流程的一部分。

## 初始迁移规则

- `1Rasy/mdlztest` 的初始内容由 `1Rasy/spr` 的 `stock-adjustment-phase-c` 分支完整镜像而来。
- 初始镜像必须保留原 Git 提交历史，而不是重新上传一份没有共同历史的散文件。
- 这样 `mdlztest/main` 与 `spr` 仍有共同祖先，后续可以通过合并或挑选提交同步。

## 后续同步规则

### 测试阶段

```text
AI 修改代码
  ↓
提交到 1Rasy/mdlztest main
  ↓
测试项目自动部署
  ↓
用户实际操作验收
```

### 验收通过

```text
确认本轮通过的提交
  ↓
在 1Rasy/spr 同步正式仓库最新代码
  ↓
合并或挑选 mdlztest 中已验收提交
  ↓
运行测试
  ↓
更新 1Rasy/spr main
```

### 验收不通过

- 继续在 `1Rasy/mdlztest/main` 修改。
- 不更新 `1Rasy/spr/main`。
- 修复后由用户再次在测试网页验收。

## 跨仓库同步影响

跨仓库本身不会导致代码失效，但需要明确以下边界：

1. 两个仓库不会自动双向同步。
2. 如果只在 `mdlztest` 开发、验收通过后再同步到 `spr`，流程稳定且清晰。
3. 如果两个仓库同时修改同一个文件，回同步时可能产生 Git 冲突，需要人工或 AI 处理。
4. 为减少冲突，测试期间尽量不要在 `spr/main` 同时修改相同功能文件。
5. 同步时优先使用 Git 合并或挑选提交，不采用手工复制单个文件的方式。
6. 每次同步正式仓库前必须先运行相关自动化测试。

## 数据库与外部服务边界

仓库分开不等于数据库和外部服务也自动隔离。

当前页面代码仍连接既有 Supabase 项目。如果测试仓库执行数据库写入、审核、库存调整或 migration，可能仍然影响同一个后端数据环境。需要真正隔离测试数据时，应另建测试数据库或测试 Supabase 项目；仅创建 `mdlztest` 仓库不会自动实现后端隔离。

## 文档优先级

本决策取代以下旧流程中的“双分支同步、PR 分支与网页测试分支并行维护”部分：

- `docs/decisions/BRANCH-TEST-FILES-001.md`
- `docs/status/STOCK-ADJUSTMENT-PHASE-C.md` 中关于 `feat/stock-adjustment-phase-c`、`stock-adjustment-phase-c` 和 PR #3 的后续工作流描述

上述文件仍可作为历史实现记录，但未来仓库与验收流程以本文为准。
