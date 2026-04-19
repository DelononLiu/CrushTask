// Re-export from components-core for shared types
import { Task, AIMessage } from '@/components-core/types';

export type { Task, AIMessage } from '@/components-core/types';

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
        status: 'completed',
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
            title: '实现左侧产品树',
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
            fullPath: 'CrushTask → 用户界面 → 实现左侧产品树',
            children: []
          },
          {
            id: 'task-list-view',
            title: '实现任务列表视图',
            module: 'CrushTask',
            subFeature: '用户界面',
            status: 'completed',
            priority: 'high',
            goal: '展示分组任务卡片，按状态分类',
            input: '子任务数据',
            output: '分组卡片列表',
            constraints: '按正在进行/计划/完成分组',
            acceptanceCriteria: ['分组显示正确', '卡片展示关键信息', '支持双击跳转详情'],
            context: {
              project: 'CrushTask',
              techStack: ['React', 'TypeScript'],
              relatedFiles: ['src/components/task-detail/ListView.tsx']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 用户界面 → 实现任务列表视图',
            children: []
          },
          {
            id: 'task-detail-view',
            title: '实现任务详情视图',
            module: 'CrushTask',
            subFeature: '用户界面',
            status: 'completed',
            priority: 'high',
            goal: '上下布局：任务信息 + AI对话',
            input: '选中任务数据',
            output: '任务详情 + AI对话框',
            constraints: '单行Header + AI对话',
            acceptanceCriteria: ['Header单行显示状态/优先级/编辑/删除/验收', 'AI对话功能可用', '验收通过/驳回功能'],
            context: {
              project: 'CrushTask',
              techStack: ['React', 'TypeScript'],
              relatedFiles: ['src/components/task-detail/index.tsx', 'src/components/task-detail/Chat.tsx', 'src/components/task-detail/TaskHeader.tsx']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 用户界面 → 实现任务详情视图',
            children: []
          },
          {
            id: 'task-header-refactor',
            title: '重构Header布局',
            module: 'CrushTask',
            subFeature: '用户界面',
            status: 'completed',
            priority: 'high',
            goal: 'Header显示当前任务父节点，三横在左侧',
            input: '当前任务数据',
            output: 'Header显示CrushTask | 父节点名',
            constraints: '返回时更新父节点',
            acceptanceCriteria: ['三横在Header左侧', '显示CrushTask | 父节点', '点击返回更新父节点'],
            context: {
              project: 'CrushTask',
              techStack: ['React'],
              relatedFiles: ['src/app/page.tsx']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 用户界面 → 重构Header布局',
            children: []
          },
          {
            id: 'task-responsive',
            title: '实现响应式布局',
            module: 'CrushTask',
            subFeature: '用户界面',
            status: 'completed',
            priority: 'medium',
            goal: '适配PC和移动端',
            input: '屏幕尺寸',
            output: '自适应布局',
            constraints: '移动端抽屉式侧边栏，全局Header',
            acceptanceCriteria: ['PC端正常显示', '移动端可交互', '不断行不重叠'],
            context: {
              project: 'CrushTask',
              techStack: ['TailwindCSS'],
              relatedFiles: ['src/app/page.tsx']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 用户界面 → 实现响应式布局',
            children: []
          }
        ]
      },
      {
        id: 'cat-ai',
        title: 'AI交互',
        module: 'CrushTask',
        subFeature: 'AI交互',
        status: 'completed',
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
            title: '实现AI对话功能',
            module: 'CrushTask',
            subFeature: 'AI交互',
            status: 'completed',
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
            fullPath: 'CrushTask → AI交互 → 实现AI对话功能',
            children: []
          },
          {
            id: 'task-acceptance',
            title: '实现验收测试',
            module: 'CrushTask',
            subFeature: 'AI交互',
            status: 'completed',
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
            fullPath: 'CrushTask → AI交互 → 实现验收测试',
            children: []
          },
          {
            id: 'task-ai-exec',
            title: '实现AI执行引擎',
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
            fullPath: 'CrushTask → AI交互 → 实现AI执行引擎',
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
            title: '实现本地存储',
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
            fullPath: 'CrushTask → 数据存储 → 实现本地存储',
            children: []
          }
        ]
      },
      {
        id: 'cat-improve',
        title: '产品改进',
        module: 'CrushTask',
        subFeature: '产品改进',
        status: 'in_progress',
        priority: 'high',
        goal: '持续优化产品体验',
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
            id: 'task-edit',
            title: '实现任务编辑功能',
            module: 'CrushTask',
            subFeature: '产品改进',
            status: 'pending',
            priority: 'high',
            goal: '支持编辑任务标题、目标、状态等信息',
            input: '任务数据',
            output: '更新的任务数据',
            constraints: '点击编辑按钮弹出编辑面板',
            acceptanceCriteria: ['编辑按钮可用', '弹出编辑面板', '保存后数据更新'],
            context: {
              project: 'CrushTask',
              techStack: ['React']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 产品改进 → 实现任务编辑功能',
            children: []
          },
          {
            id: 'task-persist',
            title: '实现数据持久化',
            module: 'CrushTask',
            subFeature: '产品改进',
            status: 'pending',
            priority: 'high',
            goal: '使用localStorage持久化任务数据',
            input: '任务数据',
            output: '持久化的任务状态',
            constraints: '页面刷新后数据保持',
            acceptanceCriteria: ['数据保存成功', '刷新后数据恢复'],
            context: {
              project: 'CrushTask',
              techStack: ['localStorage', 'React']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 产品改进 → 实现数据持久化',
            children: []
          },
          {
            id: 'task-full-acceptance',
            title: '显示完整验收标准',
            module: 'CrushTask',
            subFeature: '产品改进',
            status: 'pending',
            priority: 'medium',
            goal: '验收标准完整显示，不限制数量',
            input: '验收标准数据',
            output: '完整展示',
            constraints: 'Header区域显示更多验收项',
            acceptanceCriteria: ['显示所有验收项', '可滚动查看'],
            context: {
              project: 'CrushTask',
              techStack: ['React']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → 产品改进 → 显示完整验收标准',
            children: []
          }
        ]
      },
      {
        id: 'cat-vscode',
        title: 'VSCode插件',
        module: 'CrushTask',
        subFeature: 'VSCode插件',
        status: 'pending',
        priority: 'medium',
        goal: '开发VSCode插件版本',
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
            id: 'task-vscode-arch',
            title: '设计VSCode插件架构',
            module: 'CrushTask',
            subFeature: 'VSCode插件',
            status: 'pending',
            priority: 'medium',
            goal: '复用components-core，适配VSCode API',
            input: 'components-core组件',
            output: 'VSCode插件代码',
            constraints: '保持核心逻辑不变',
            acceptanceCriteria: ['架构设计完成', '组件复用验证'],
            context: {
              project: 'CrushTask',
              techStack: ['VSCode API', 'TypeScript']
            },
            aiMessages: [],
            nodeType: 'task',
            fullPath: 'CrushTask → VSCode插件 → 设计VSCode插件架构',
            children: []
          }
        ]
      }
    ]
  }
];