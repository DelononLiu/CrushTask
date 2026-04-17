export interface TaskNode {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  aiMessages: AIMessage[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  techStack: string[];
  designNotes?: string;
  dueDate?: string;
  children: Task[];
  expanded?: boolean;
  nodes?: TaskNode[];
  currentNodeId?: string;
  level?: 'product' | 'feature' | 'task' | 'subtask';
}

export const initialTasks: Task[] = [
  {
    id: 'crush',
    title: 'CrushTask',
    description: 'AI驱动的任务管理系统，通过人机协作提升工作效率',
    status: 'in_progress',
    priority: 'high',
    tags: ['产品', 'AI'],
    techStack: ['Next.js', 'React', 'AI Agent'],
    designNotes: '简洁现代风格，AI辅助完成任务',
    expanded: true,
    level: 'product',
    nodes: [
      { id: 'n1', title: '任务创建', status: 'completed', startTime: '2024-01-10', endTime: '2024-01-15', aiMessages: [
        { id: 'm1', role: 'user', content: '实现任务创建功能', timestamp: '2024-01-10 09:00' },
        { id: 'm2', role: 'assistant', content: '好的，我来帮你设计任务创建流程：\n\n1. 用户描述需求\n2. AI理解并拆解任务\n3. 自动生成任务节点\n4. 展示给用户确认', timestamp: '2024-01-10 09:01' }
      ]},
      { id: 'n2', title: 'AI对话', status: 'completed', startTime: '2024-01-16', endTime: '2024-01-25', aiMessages: [
        { id: 'm3', role: 'user', content: '实现AI对话功能', timestamp: '2024-01-16 10:00' },
        { id: 'm4', role: 'assistant', content: 'AI对话核心功能：\n\n1. 流式响应\n2. 代码高亮\n3. 文件操作\n4. 执行结果展示', timestamp: '2024-01-16 10:05' }
      ]},
      { id: 'n3', title: '任务节点图', status: 'in_progress', startTime: '2024-01-26', aiMessages: [
        { id: 'm5', role: 'user', content: '实现蛇形节点图', timestamp: '2024-01-26 09:00' },
        { id: 'm6', role: 'assistant', content: '节点图设计：\n\n1. 可视化任务进度\n2. 点击节点进入AI对话\n3. 状态自动更新\n4. 历史对话保留', timestamp: '2024-01-26 09:15' }
      ]},
      { id: 'n4', title: '产品结构', status: 'pending', aiMessages: [] },
      { id: 'n5', title: '部署发布', status: 'pending', aiMessages: [] }
    ],
    currentNodeId: 'n3',
    children: [
      {
        id: 'f1',
        title: '任务TAB',
        description: '显示当前进行中和待处理的任务',
        status: 'completed',
        priority: 'high',
        tags: ['功能', '首页'],
        techStack: ['React'],
        designNotes: '任务TAB展示所有进行中的任务',
        level: 'feature',
        children: [
          {
            id: 't1',
            title: '任务列表',
            description: '展示任务列表',
            status: 'completed',
            priority: 'high',
            tags: ['任务'],
            techStack: ['React'],
            designNotes: '列表展示',
            level: 'task',
            children: [],
          },
        ],
      },
      {
        id: 'f2',
        title: '产品TAB',
        description: '产品功能层级展示',
        status: 'completed',
        priority: 'high',
        tags: ['功能', '产品'],
        techStack: ['React'],
        designNotes: '产品-功能-任务层级',
        level: 'feature',
        children: [
          {
            id: 't2',
            title: '层级展示',
            description: '产品功能任务层级',
            status: 'completed',
            priority: 'high',
            tags: ['任务'],
            techStack: ['React'],
            designNotes: '展开收起',
            level: 'task',
            children: [],
          },
        ],
      },
      {
        id: 'f3',
        title: '任务详情',
        description: 'AI对话式任务详情',
        status: 'in_progress',
        priority: 'high',
        tags: ['功能', '详情'],
        techStack: ['React', 'AI'],
        level: 'feature',
        children: [
          {
            id: 't3',
            title: '节点图',
            description: '蛇形节点图展示',
            status: 'in_progress',
            priority: 'high',
            tags: ['任务'],
            techStack: ['SVG'],
            level: 'task',
            children: [],
          },
          {
            id: 't4',
            title: 'AI对话',
            description: 'AI对话界面',
            status: 'pending',
            priority: 'medium',
            tags: ['任务'],
            techStack: ['React'],
            level: 'task',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'p1',
    title: 'CRM客户管理系统',
    description: '企业内部客户关系管理系统',
    status: 'in_progress',
    priority: 'high',
    tags: ['产品', '企业级'],
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    designNotes: '专业商务风格，数据看板为主',
    expanded: true,
    level: 'product',
    nodes: [
      { id: 'n1', title: '客户管理', status: 'completed', startTime: '2024-01-10', endTime: '2024-01-15', aiMessages: [
        { id: 'm1', role: 'user', content: '开始客户管理功能', timestamp: '2024-01-10 09:00' },
        { id: 'm2', role: 'assistant', content: '好的，我来帮你实现客户管理功能。需要：\n1. 客户列表展示\n2. 客户新增/编辑\n3. 客户删除\n4. 客户搜索和筛选', timestamp: '2024-01-10 09:01' }
      ]},
      { id: 'n2', title: '销售跟踪', status: 'completed', startTime: '2024-01-16', endTime: '2024-01-25', aiMessages: [
        { id: 'm3', role: 'user', content: '开始销售跟踪功能', timestamp: '2024-01-16 10:00' },
        { id: 'm4', role: 'assistant', content: '销售跟踪功能包括：\n1. 销售机会管理\n2. 跟进记录\n3. 销售漏斗展示\n4. 销售统计分析', timestamp: '2024-01-16 10:05' }
      ]},
      { id: 'n3', title: '报表分析', status: 'in_progress', startTime: '2024-01-26', aiMessages: [
        { id: 'm5', role: 'user', content: '开始报表分析功能', timestamp: '2024-01-26 09:00' },
        { id: 'm6', role: 'assistant', content: '好的，需要实现：\n1. 数据仪表盘\n2. 销售报表\n3. 客户分析\n4. 自定义报表', timestamp: '2024-01-26 09:15' }
      ]},
      { id: 'n4', title: '数据导入', status: 'pending', aiMessages: [] },
      { id: 'n5', title: '数据导出', status: 'pending', aiMessages: [] }
    ],
    currentNodeId: 'n3',
    children: [
      {
        id: 'f1',
        title: '用户认证',
        description: '用户登录注册相关功能',
        status: 'completed',
        priority: 'high',
        tags: ['功能', '认证'],
        techStack: ['NextAuth', 'JWT'],
        designNotes: '简洁的登录表单，支持记住密码',
        level: 'feature',
        children: [
          {
            id: 't1',
            title: '邮箱密码登录',
            description: '实现邮箱密码验证登录',
            status: 'completed',
            priority: 'high',
            tags: ['任务', '后端'],
            techStack: ['Next.js', 'JWT'],
            designNotes: '密码加密存储，token验证',
            level: 'task',
            children: [],
          },
          {
            id: 't2',
            title: '企业SSO登录',
            description: '集成企业域账号SSO登录',
            status: 'completed',
            priority: 'high',
            tags: ['任务', 'SSO'],
            techStack: ['SAML2.0'],
            designNotes: '支持企业AD域认证',
            level: 'task',
            children: [],
          },
        ],
      },
      {
        id: 'f2',
        title: '客户数据导入',
        description: '支持Excel/CSV批量导入客户数据',
        status: 'in_progress',
        priority: 'high',
        tags: ['功能', '导入'],
        techStack: ['React', 'xlsx'],
        designNotes: '支持字段映射和数据校验',
        level: 'feature',
        children: [
          {
            id: 't3',
            title: 'Excel解析',
            description: '解析xlsx格式文件',
            status: 'completed',
            priority: 'high',
            tags: ['任务'],
            techStack: ['xlsx'],
            designNotes: '支持多sheet和日期格式',
            level: 'task',
            children: [],
          },
          {
            id: 't4',
            title: '字段映射',
            description: '用户自定义Excel列与系统字段的映射关系',
            status: 'pending',
            priority: 'medium',
            tags: ['任务'],
            techStack: ['React'],
            designNotes: '拖拽式映射操作',
            level: 'task',
            children: [],
          },
        ],
      },
      {
        id: 'f3',
        title: '数据导出',
        description: '支持将客户数据导出为Excel格式',
        status: 'pending',
        priority: 'medium',
        tags: ['功能', '导出'],
        techStack: ['xlsx'],
        designNotes: '支持自定义导出字段',
        level: 'feature',
        children: [],
      },
    ],
  },
  {
    id: 'p2',
    title: 'AI助手Web应用',
    description: '基于大语言模型的AI对话助手',
    status: 'in_progress',
    priority: 'high',
    tags: ['产品', 'AI'],
    techStack: ['Next.js', 'OpenAI API', 'WebSocket'],
    designNotes: '简洁现代风格，类ChatGPT布局',
    expanded: true,
    level: 'product',
    children: [
      {
        id: 'f4',
        title: '主题切换',
        description: '实现主题切换功能，支持亮色/深色模式',
        status: 'in_progress',
        priority: 'medium',
        tags: ['功能', 'UI'],
        techStack: ['React', 'Tailwind CSS'],
        designNotes: '深色主题采用中性灰配色，保护眼睛',
        level: 'feature',
        children: [
          {
            id: 't5',
            title: '主题切换组件',
            description: '开发可复用的主题切换开关',
            status: 'in_progress',
            priority: 'medium',
            tags: ['任务', 'UI'],
            techStack: ['React', 'Tailwind'],
            designNotes: '切换动画流畅',
            level: 'task',
            children: [],
          },
          {
            id: 't6',
            title: '主题持久化',
            description: '保存用户的主题偏好到localStorage',
            status: 'pending',
            priority: 'low',
            tags: ['任务', '存储'],
            techStack: ['localStorage'],
            designNotes: '刷新页面后保持主题设置',
            level: 'task',
            children: [],
          },
        ],
      },
      {
        id: 'f5',
        title: '移动端适配',
        description: '优化移动端界面和交互',
        status: 'pending',
        priority: 'medium',
        tags: ['Bug', '移动端'],
        techStack: ['CSS', 'React'],
        designNotes: '移动端采用汉堡菜单',
        level: 'feature',
        children: [],
      },
      {
        id: 'f6',
        title: '对话历史',
        description: '保存和展示用户的对话历史',
        status: 'pending',
        priority: 'high',
        tags: ['功能', '存储'],
        techStack: ['MongoDB', 'React'],
        designNotes: '左侧栏显示历史记录列表',
        level: 'feature',
        children: [],
      },
    ],
  },
];