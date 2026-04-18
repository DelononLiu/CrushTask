export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TaskContext {
  project?: string;
  techStack?: string[];
  relatedFiles?: string[];
  dependentTasks?: string[];
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  module: string;
  subFeature: string;
  status: TaskStatus;
  priority: TaskPriority;
  
  // 任务本体（核心内容）
  goal: string;
  input: string;
  output: string;
  constraints: string;
  acceptanceCriteria: string[];
  
  // 上下文信息
  context: TaskContext;
  
  // AI对话记录
  aiMessages: AIMessage[];
  
  // 子任务
  children: Task[];
  expanded?: boolean;
}

export const initialTasks: Task[] = [
  // 根节点：CrushTask
  {
    id: 'crush-task',
    title: 'CrushTask',
    module: 'CrushTask',
    subFeature: '',
    status: 'in_progress',
    priority: 'high',
    goal: '以AI为核心的任务执行系统',
    input: '',
    output: '',
    constraints: '',
    acceptanceCriteria: [],
    context: {},
    aiMessages: [],
    expanded: true,
    children: [
      // 一级模块：产品核心
      {
        id: 'product-core',
        title: '产品核心',
        module: 'CrushTask',
        subFeature: '产品核心',
        status: 'in_progress',
        priority: 'high',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        expanded: true,
        children: [
          // 二级子功能：左侧任务树
          {
            id: 'left-tree',
            title: '左侧任务树',
            module: 'CrushTask',
            subFeature: '左侧任务树',
            status: 'completed',
            priority: 'high',
            goal: '四级节点任务树结构展示',
            input: '任务数据结构',
            output: '树形UI',
            constraints: '符合PRD图标与颜色规范',
            acceptanceCriteria: ['节点渲染正确', '图标区分正确', '交互逻辑正确'],
            context: { project: 'CrushTask Web', techStack: ['React'] },
            aiMessages: [],
            children: [
              {
                id: 'task-node-render',
                title: '节点渲染',
                module: 'CrushTask',
                subFeature: '左侧任务树',
                status: 'completed',
                priority: 'high',
                goal: '四级节点正确渲染',
                input: '任务数据',
                output: '树形UI',
                constraints: '',
                acceptanceCriteria: [],
                context: {},
                aiMessages: [],
                children: []
              },
              {
                id: 'task-icon',
                title: '图标区分',
                module: 'CrushTask',
                subFeature: '左侧任务树',
                status: 'completed',
                priority: 'high',
                goal: '不同层级显示不同图标',
                input: '',
                output: '图标显示',
                constraints: '',
                acceptanceCriteria: [],
                context: {},
                aiMessages: [],
                children: []
              },
              {
                id: 'task-interaction',
                title: '交互逻辑',
                module: 'CrushTask',
                subFeature: '左侧任务树',
                status: 'completed',
                priority: 'high',
                goal: '原子任务可点击刷新详情',
                input: '',
                output: '',
                constraints: '',
                acceptanceCriteria: [],
                context: {},
                aiMessages: [],
                children: []
              }
            ]
          },
          // 二级子功能：中部任务面板
          {
            id: 'center-panel',
            title: '中部任务面板',
            module: 'CrushTask',
            subFeature: '中部任务面板',
            status: 'in_progress',
            priority: 'high',
            goal: '任务详情模块化展示',
            input: '任务数据',
            output: '模块化UI',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: [
              {
                id: 'panel-module',
                title: '模块化展示',
                module: 'CrushTask',
                subFeature: '中部任务面板',
                status: 'completed',
                priority: 'high',
                goal: '任务本体模块化折叠展示',
                input: '',
                output: '',
                constraints: '',
                acceptanceCriteria: [],
                context: {},
                aiMessages: [],
                children: []
              },
              {
                id: 'panel-tabs',
                title: '标签页切换',
                module: 'CrushTask',
                subFeature: '中部任务面板',
                status: 'in_progress',
                priority: 'high',
                goal: '四个标签页切换',
                input: '',
                output: '',
                constraints: '',
                acceptanceCriteria: [],
                context: {},
                aiMessages: [],
                children: []
              }
            ]
          },
          // 二级子功能：AI执行引擎
          {
            id: 'ai-engine',
            title: 'AI执行引擎',
            module: 'CrushTask',
            subFeature: 'AI执行引擎',
            status: 'pending',
            priority: 'high',
            goal: 'AI解析结构化任务并输出结果',
            input: '任务字段',
            output: '代码/日志/结果',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: [
              {
                id: 'ai-parse',
                title: '任务解析',
                module: 'CrushTask',
                subFeature: 'AI执行引擎',
                status: 'pending',
                priority: 'high',
                goal: 'AI解析结构化任务字段',
                input: '',
                output: '',
                constraints: '',
                acceptanceCriteria: [],
                context: {},
                aiMessages: [],
                children: []
              },
              {
                id: 'ai-output',
                title: '结果输出',
                module: 'CrushTask',
                subFeature: 'AI执行引擎',
                status: 'pending',
                priority: 'high',
                goal: '代码生成、执行日志、结果返回',
                input: '',
                output: '',
                constraints: '',
                acceptanceCriteria: [],
                context: {},
                aiMessages: [],
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
];