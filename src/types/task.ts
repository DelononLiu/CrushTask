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
  {
    id: 'crush-task',
    title: 'CrushTask',
    module: 'CrushTask',
    subFeature: '',
    status: 'in_progress',
    priority: 'high',
    goal: '以AI为核心的任务执行编排系统',
    input: '产品需求文档、PRD定义',
    output: '可运行的任务管理系统',
    constraints: '基于现有代码大模型构建',
    acceptanceCriteria: ['任务树正确显示', 'AI对话功能完整', '响应式布局适配'],
    context: {
      project: 'CrushTask',
      techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
      relatedFiles: ['src/app/page.tsx', 'src/components/TaskTree.tsx', 'src/components/TaskDetail.tsx'],
      dependentTasks: []
    },
    aiMessages: [],
    expanded: true,
    nodeType: 'root',
    children: [
      {
        id: 'cat-ui',
        title: '用户界面',
        module: 'CrushTask',
        subFeature: '用户界面',
        status: 'in_progress',
        priority: 'high',
        goal: '构建完整的用户交互界面',
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
            id: 'task-sidebar',
            title: '左侧产品树',
            module: 'CrushTask',
            subFeature: '用户界面',
            status: 'completed',
            priority: 'high',
            goal: '实现树形任务导航，支持展开折叠',
            input: '任务层级结构数据',
            output: '可交互的树形组件',
            constraints: '固定宽度260px，支持多级展开',
            acceptanceCriteria: ['树形结构正确显示', '支持点击展开/折叠', '选中状态高亮'],
            context: {
              project: 'CrushTask',
              techStack: ['React', 'TypeScript'],
              relatedFiles: ['src/components/TaskTree.tsx', 'src/components/task-tree/TreeNode.tsx']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 用户界面 → 左侧产品树',
            children: []
          },
          {
            id: 'task-list-view',
            title: '任务列表视图',
            module: 'CrushTask',
            subFeature: '用户界面',
            status: 'in_progress',
            priority: 'high',
            goal: '展示分组任务卡片，按状态分类',
            input: '子任务数据',
            output: '分组卡片列表',
            constraints: '按正在进行/计划/完成分组',
            acceptanceCriteria: ['分组显示正确', '卡片展示关键信息', '支持点击跳转详情'],
            context: {
              project: 'CrushTask',
              techStack: ['React', 'TypeScript'],
              relatedFiles: ['src/components/task-detail/ListView.tsx']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 用户界面 → 任务列表视图',
            children: []
          },
          {
            id: 'task-detail-view',
            title: '任务详情视图',
            module: 'CrushTask',
            subFeature: '用户界面',
            status: 'in_progress',
            priority: 'high',
            goal: '上下布局：任务信息 + AI对话',
            input: '选中任务数据',
            output: '任务详情 + AI对话框',
            constraints: '30%任务信息 + 70%AI对话',
            acceptanceCriteria: ['任务信息完整显示', 'AI对话功能可用', '验收通过/驳回功能'],
            context: {
              project: 'CrushTask',
              techStack: ['React', 'TypeScript'],
              relatedFiles: ['src/components/task-detail/index.tsx', 'src/components/task-detail/Chat.tsx']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 用户界面 → 任务详情视图',
            children: []
          },
          {
            id: 'task-responsive',
            title: '响应式布局',
            module: 'CrushTask',
            subFeature: '用户界面',
            status: 'completed',
            priority: 'medium',
            goal: '适配PC和移动端',
            input: '屏幕尺寸',
            output: '自适应布局',
            constraints: '移动端抽屉式侧边栏',
            acceptanceCriteria: ['PC端正常显示', '移动端可交互', '不断行不重叠'],
            context: {
              project: 'CrushTask',
              techStack: ['TailwindCSS'],
              relatedFiles: ['src/app/page.tsx']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 用户界面 → 响应式布局',
            children: []
          }
        ]
      },
      {
        id: 'cat-ai',
        title: 'AI交互',
        module: 'CrushTask',
        subFeature: 'AI交互',
        status: 'pending',
        priority: 'high',
        goal: '实现AI任务执行能力',
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
            id: 'task-ai-chat',
            title: 'AI对话功能',
            module: 'CrushTask',
            subFeature: 'AI交互',
            status: 'pending',
            priority: 'high',
            goal: '实现与AI助手的对话交互',
            input: '用户消息',
            output: 'AI响应',
            constraints: '支持发送消息、接收回复',
            acceptanceCriteria: ['消息发送接收正常', '历史记录保存', '支持/run命令'],
            context: {
              project: 'CrushTask',
              techStack: ['React', 'AI SDK'],
              relatedFiles: ['src/components/task-detail/Chat.tsx']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → AI交互 → AI对话功能',
            children: []
          },
          {
            id: 'task-acceptance',
            title: '验收测试',
            module: 'CrushTask',
            subFeature: 'AI交互',
            status: 'pending',
            priority: 'high',
            goal: 'AI自动执行验收测试并反馈结果',
            input: '验收标准、任务目标',
            output: '验收结果（通过/驳回）',
            constraints: '触发验收测试后显示按钮',
            acceptanceCriteria: ['点击验收测试触发AI', '显示通过/驳回按钮', '弹出验收意见框'],
            context: {
              project: 'CrushTask',
              techStack: ['React'],
              relatedFiles: ['src/components/task-detail/AcceptanceModal.tsx']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → AI交互 → 验收测试',
            children: []
          },
          {
            id: 'task-ai-exec',
            title: 'AI执行引擎',
            module: 'CrushTask',
            subFeature: 'AI交互',
            status: 'pending',
            priority: 'high',
            goal: 'AI解析结构化任务并执行',
            input: '任务字段（goal/input/output/constraints）',
            output: '执行结果、代码生成',
            constraints: '仅读取结构化字段',
            acceptanceCriteria: ['任务解析正确', '执行日志展示', '结果可预览'],
            context: {
              project: 'CrushTask',
              techStack: ['AI SDK', 'Node.js']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → AI交互 → AI执行引擎',
            children: []
          }
        ]
      },
      {
        id: 'cat-storage',
        title: '数据存储',
        module: 'CrushTask',
        subFeature: '数据存储',
        status: 'pending',
        priority: 'medium',
        goal: '任务数据持久化存储',
        input: '',
        output: '',
        constraints: '',
        acceptanceCriteria: [],
        context: {},
        aiMessages: [],
        expanded: false,
        nodeType: 'category',
        children: [
          {
            id: 'task-localstorage',
            title: '本地存储',
            module: 'CrushTask',
            subFeature: '数据存储',
            status: 'pending',
            priority: 'medium',
            goal: '使用localStorage持久化任务',
            input: '任务数据',
            output: '持久化的任务状态',
            constraints: '浏览器本地存储',
            acceptanceCriteria: ['数据保存成功', '页面刷新后恢复', '容量合理'],
            context: {
              project: 'CrushTask',
              techStack: ['localStorage', 'React Context']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 数据存储 → 本地存储',
            children: []
          }
        ]
      }
    ]
  }
];