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
  // 模块1：任务系统核心
  {
    id: 'm1',
    title: '任务系统核心',
    module: '任务系统核心',
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
    children: [
      {
        id: 'sf1',
        title: '任务结构定义',
        module: '任务系统核心',
        subFeature: '任务结构定义',
        status: 'in_progress',
        priority: 'high',
        goal: '设计任务的标准字段结构，包括：标题、任务目标、输入输出、约束条件、验收标准。',
        input: '无（系统定义）',
        output: '任务字段 JSON 结构',
        constraints: '1. 字段必须可被 AI 直接解析\n2. 必须支持用户自由编辑\n3. 必须简洁、无冗余',
        acceptanceCriteria: [
          '包含标题、目标、输入、输出、约束、验收清单',
          'AI 可直接读取并理解',
          '用户可编辑所有字段'
        ],
        context: { project: 'CrushTask Web', techStack: ['React', 'TypeScript'] },
        aiMessages: [],
        children: [
          {
            id: 't1',
            title: '定义任务字段',
            module: '任务系统核心',
            subFeature: '任务结构定义',
            status: 'in_progress',
            priority: 'high',
            goal: '定义任务的标准字段结构，包括：标题、任务目标、输入输出、约束条件、验收标准。',
            input: '无（系统定义）',
            output: '任务字段 JSON 结构',
            constraints: '1. 字段必须可被 AI 直接解析\n2. 必须支持用户自由编辑\n3. 必须简洁、无冗余',
            acceptanceCriteria: [
              '包含标题、目标、输入、输出、约束、验收清单',
              'AI 可直接读取并理解',
              '用户可编辑所有字段'
            ],
            context: { project: 'CrushTask Web', techStack: ['React', 'TypeScript'], relatedFiles: ['src/types/task.ts'] },
            aiMessages: [],
            children: []
          },
          {
            id: 't2',
            title: '任务状态流转',
            module: '任务系统核心',
            subFeature: '任务结构定义',
            status: 'pending',
            priority: 'medium',
            goal: '定义任务状态流转逻辑：待定义 → 待执行 → 执行中 → 待验收 → 完成',
            input: '',
            output: '',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: []
          },
          {
            id: 't3',
            title: '任务树层级管理',
            module: '任务系统核心',
            subFeature: '任务结构定义',
            status: 'pending',
            priority: 'medium',
            goal: '任务树的增删改和拖拽排序',
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
      {
        id: 'sf2',
        title: '任务上下文管理',
        module: '任务系统核心',
        subFeature: '任务上下文管理',
        status: 'pending',
        priority: 'medium',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        children: [
          {
            id: 't4',
            title: '自动关联工程信息',
            module: '任务系统核心',
            subFeature: '任务上下文管理',
            status: 'pending',
            priority: 'low',
            goal: '自动关联工程信息到任务上下文',
            input: '',
            output: '',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: []
          },
          {
            id: 't5',
            title: '手动添加上下文',
            module: '任务系统核心',
            subFeature: '任务上下文管理',
            status: 'pending',
            priority: 'low',
            goal: '允许用户手动添加上下文信息',
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
      {
        id: 'sf3',
        title: '任务验收系统',
        module: '任务系统核心',
        subFeature: '任务验收系统',
        status: 'pending',
        priority: 'medium',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        children: [
          {
            id: 't6',
            title: '生成验收清单',
            module: '任务系统核心',
            subFeature: '任务验收系统',
            status: 'pending',
            priority: 'low',
            goal: '根据任务目标自动生成验收清单',
            input: '',
            output: '',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: []
          },
          {
            id: 't7',
            title: '验收通过/驳回流程',
            module: '任务系统核心',
            subFeature: '任务验收系统',
            status: 'pending',
            priority: 'low',
            goal: '实现验收通过和驳回的操作流程',
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
  },
  // 模块2：AI执行引擎
  {
    id: 'm2',
    title: 'AI执行引擎',
    module: 'AI执行引擎',
    subFeature: '',
    status: 'pending',
    priority: 'high',
    goal: '',
    input: '',
    output: '',
    constraints: '',
    acceptanceCriteria: [],
    context: {},
    aiMessages: [],
    children: [
      {
        id: 'sf4',
        title: 'AI对话交互',
        module: 'AI执行引擎',
        subFeature: 'AI对话交互',
        status: 'pending',
        priority: 'high',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        children: [
          {
            id: 't8',
            title: '任务指令下发',
            module: 'AI执行引擎',
            subFeature: 'AI对话交互',
            status: 'pending',
            priority: 'medium',
            goal: '用户向AI下发任务指令',
            input: '',
            output: '',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: []
          },
          {
            id: 't9',
            title: '执行日志展示',
            module: 'AI执行引擎',
            subFeature: 'AI对话交互',
            status: 'pending',
            priority: 'medium',
            goal: '展示AI执行过程中的日志',
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
      {
        id: 'sf5',
        title: '代码生成与Diff',
        module: 'AI执行引擎',
        subFeature: '代码生成与Diff',
        status: 'pending',
        priority: 'high',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        children: [
          {
            id: 't10',
            title: 'AI生成代码预览',
            module: 'AI执行引擎',
            subFeature: '代码生成与Diff',
            status: 'pending',
            priority: 'medium',
            goal: 'AI生成代码的实时预览',
            input: '',
            output: '',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: []
          },
          {
            id: 't11',
            title: '代码差异对比',
            module: 'AI执行引擎',
            subFeature: '代码生成与Diff',
            status: 'pending',
            priority: 'medium',
            goal: '新旧代码的差异对比展示',
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
  },
  // 模块3：Web界面
  {
    id: 'm3',
    title: 'Web界面',
    module: 'Web界面',
    subFeature: '',
    status: 'pending',
    priority: 'high',
    goal: '',
    input: '',
    output: '',
    constraints: '',
    acceptanceCriteria: [],
    context: {},
    aiMessages: [],
    children: [
      {
        id: 'sf6',
        title: '左侧任务树UI',
        module: 'Web界面',
        subFeature: '左侧任务树UI',
        status: 'pending',
        priority: 'high',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        children: [
          {
            id: 't12',
            title: '树结构渲染',
            module: 'Web界面',
            subFeature: '左侧任务树UI',
            status: 'pending',
            priority: 'medium',
            goal: '渲染任务树的树形结构',
            input: '',
            output: '',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: []
          },
          {
            id: 't13',
            title: '节点点击打开任务',
            module: 'Web界面',
            subFeature: '左侧任务树UI',
            status: 'pending',
            priority: 'medium',
            goal: '点击任务节点打开对应任务详情',
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
      {
        id: 'sf7',
        title: '中央任务详情UI',
        module: 'Web界面',
        subFeature: '中央任务详情UI',
        status: 'pending',
        priority: 'high',
        goal: '',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        children: [
          {
            id: 't14',
            title: '任务表单渲染',
            module: 'Web界面',
            subFeature: '中央任务详情UI',
            status: 'pending',
            priority: 'medium',
            goal: '渲染任务详情表单',
            input: '',
            output: '',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: []
          },
          {
            id: 't15',
            title: 'AI对话面板',
            module: 'Web界面',
            subFeature: '中央任务详情UI',
            status: 'pending',
            priority: 'medium',
            goal: 'AI对话交互面板',
            input: '',
            output: '',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: []
          },
          {
            id: 't16',
            title: '上下文面板',
            module: 'Web界面',
            subFeature: '中央任务详情UI',
            status: 'pending',
            priority: 'low',
            goal: '展示任务上下文信息',
            input: '',
            output: '',
            constraints: '',
            acceptanceCriteria: [],
            context: {},
            aiMessages: [],
            children: []
          },
          {
            id: 't17',
            title: '验收面板',
            module: 'Web界面',
            subFeature: '中央任务详情UI',
            status: 'pending',
            priority: 'low',
            goal: '任务验收功能面板',
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
];