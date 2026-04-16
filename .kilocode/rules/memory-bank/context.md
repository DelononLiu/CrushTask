# Active Context: AI驱动任务管理系统

## Current State

**应用状态**: ✅ 功能完成 (V2 - AI驱动模式)

这是一个AI驱动的任务管理系统，核心设计理念：不是勾选任务，而是和AI对话驱动任务完成，人是审核者。每个任务显示蛇形过程节点图，点击节点进入AI对话。

## Recently Completed

- [x] 添加TaskNode和AIMessage类型定义
- [x] 创建TaskFlowDiagram组件（蛇形节点图）
- [x] 修改TaskDetail为三个Tab：详情、进度流、AI对话
- [x] 实现节点点击进入AI对话功能
- [x] 添加示例任务节点数据（CRM系统示例）

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/types/index.ts` | 任务类型定义（含节点） | ✅ |
| `src/components/TaskFlowDiagram.tsx` | 蛇形进度节点图 | ✅ |
| `src/components/TaskDetail.tsx` | 任务详情+AI对话 | ✅ |

## 功能特性

- 蛇形进度节点图展示任务进度
- 节点显示状态（pending/in_progress/completed）
- 点击节点进入AI对话
- 节点内保存AI对话历史
- 三个Tab切换：详情/进度流/AI对话

## Session History

| Date | Changes |
|------|---------|
| 2026-04-14 | 创建树形任务管理器V1 |
| 2026-04-16 | 升级为AI驱动模式，添加蛇形节点图和AI对话功能 |