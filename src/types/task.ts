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
  
  goal: string;
  input: string;
  output: string;
  constraints: string;
  acceptanceCriteria: string[];
  
  context: TaskContext;
  aiMessages: AIMessage[];
  children: Task[];
  expanded?: boolean;
  
  nodeType?: 'root' | 'category' | 'task';
  fullPath?: string;
}

export const initialTasks: Task[] = [
  // 产品视角根节点
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
    nodeType: 'root',
    children: [
      {
        id: 'cat-left-tree',
        title: '左侧任务树',
        module: 'CrushTask',
        subFeature: '左侧任务树',
        status: 'completed',
        priority: 'high',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        expanded: true,
        nodeType: 'category',
        children: [
          {
            id: 'task-icon-impl',
            title: '实现图标区分',
            module: 'CrushTask',
            subFeature: '左侧任务树',
            status: 'completed',
            priority: 'high',
            goal: '四级节点不同图标显示',
            input: '',
            output: '',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 左侧任务树 → 实现图标区分',
            children: []
          }
        ]
      },
      {
        id: 'cat-ai-engine',
        title: 'AI执行引擎',
        module: 'CrushTask',
        subFeature: 'AI执行引擎',
        status: 'pending',
        priority: 'high',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        expanded: true,
        nodeType: 'category',
        children: [
          {
            id: 'task-parse',
            title: '实现任务解析',
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
            nodeType: 'task',
            fullPath: 'CrushTask → AI执行引擎 → 实现任务解析',
            children: []
          }
        ]
      },
      {
        id: 'cat-center-panel',
        title: '中部任务面板',
        module: 'CrushTask',
        subFeature: '中部任务面板',
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
        nodeType: 'category',
        children: [
          {
            id: 'task-module',
            title: '实现模块化展示',
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
            nodeType: 'task',
            fullPath: 'CrushTask → 中部任务面板 → 实现模块化展示',
            children: []
          }
        ]
      }
    ]
  },
  // My Tasks 聚合视图
  {
    id: 'my-tasks',
    title: 'My Tasks',
    module: 'My Tasks',
    subFeature: '',
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
    nodeType: 'root',
    children: [
      {
        id: 'task-icon-copy',
        title: '实现图标区分',
        module: 'CrushTask',
        subFeature: '左侧任务树',
        status: 'completed',
        priority: 'high',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        nodeType: 'task',
        fullPath: 'CrushTask → 左侧任务树 → 实现图标区分',
        children: []
      },
      {
        id: 'task-parse-copy',
        title: '实现任务解析',
        module: 'CrushTask',
        subFeature: 'AI执行引擎',
        status: 'pending',
        priority: 'high',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        nodeType: 'task',
        fullPath: 'CrushTask → AI执行引擎 → 实现任务解析',
        children: []
      },
      {
        id: 'task-module-copy',
        title: '实现模块化展示',
        module: 'CrushTask',
        subFeature: '中部任务面板',
        status: 'completed',
        priority: 'high',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        nodeType: 'task',
        fullPath: 'CrushTask → 中部任务面板 → 实现模块化展示',
        children: []
      }
    ]
  }
];
