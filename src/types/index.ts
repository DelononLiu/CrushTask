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
  designNotes: string;
  dueDate?: string;
  children: Task[];
  expanded?: boolean;
  nodes?: TaskNode[];
  currentNodeId?: string;
}

export const initialTasks: Task[] = [
  {
    id: 'p1',
    title: 'CRM客户管理系统',
    description: '企业内部客户关系管理系统',
    status: 'in_progress',
    priority: 'high',
    tags: ['项目', '企业级'],
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    designNotes: '专业商务风格，数据看板为主',
    expanded: true,
    nodes: [
      { id: 'n1', title: '需求分析', status: 'completed', startTime: '2024-01-10', endTime: '2024-01-15', aiMessages: [
        { id: 'm1', role: 'user', content: '开始CRM系统的需求分析', timestamp: '2024-01-10 09:00' },
        { id: 'm2', role: 'assistant', content: '好的，我来帮你梳理CRM系统的需求。首先需要了解：\n1. 目标用户规模\n2. 核心业务流程\n3. 需要集成的外部系统', timestamp: '2024-01-10 09:01' }
      ]},
      { id: 'n2', title: '系统设计', status: 'completed', startTime: '2024-01-16', endTime: '2024-01-25', aiMessages: [
        { id: 'm3', role: 'user', content: '需求已确定，开始系统设计', timestamp: '2024-01-16 10:00' },
        { id: 'm4', role: 'assistant', content: '根据需求，我设计了以下架构：\n- 前端：React + TypeScript\n- 后端：Node.js + Express\n- 数据库：PostgreSQL\n- 认证：JWT + SSO', timestamp: '2024-01-16 10:05' }
      ]},
      { id: 'n3', title: '前端开发', status: 'in_progress', startTime: '2024-01-26', aiMessages: [
        { id: 'm5', role: 'user', content: '开始前端开发工作', timestamp: '2024-01-26 09:00' },
        { id: 'm6', role: 'assistant', content: '好的，开始前端开发。已创建项目结构，主要包括：\n1. 登录页面\n2. 客户列表页\n3. 客户详情页\n4. 数据看板', timestamp: '2024-01-26 09:15' }
      ]},
      { id: 'n4', title: '后端开发', status: 'pending', aiMessages: [] },
      { id: 'n5', title: '测试与部署', status: 'pending', aiMessages: [] }
    ],
    currentNodeId: 'n3',
    children: [
      {
        id: 'p1-1',
        title: '用户登录功能',
        description: '实现邮箱密码登录和第三方登录功能',
        status: 'completed',
        priority: 'high',
        tags: ['功能', '认证'],
        techStack: ['NextAuth', 'JWT'],
        designNotes: '简洁的登录表单，支持记住密码',
        children: [
          {
            id: 'p1-1-1',
            title: '邮箱密码登录',
            description: '实现邮箱密码验证登录',
            status: 'completed',
            priority: 'high',
            tags: ['功能', '后端'],
            techStack: ['Next.js', 'JWT'],
            designNotes: '密码加密存储，token验证',
            children: [],
          },
          {
            id: 'p1-1-2',
            title: '企业SSO登录',
            description: '集成企业域账号SSO登录',
            status: 'completed',
            priority: 'high',
            tags: ['功能', 'SSO'],
            techStack: ['SAML2.0'],
            designNotes: '支持企业AD域认证',
            children: [],
          },
        ],
      },
      {
        id: 'p1-2',
        title: '客户数据导入',
        description: '支持Excel/CSV批量导入客户数据',
        status: 'in_progress',
        priority: 'high',
        tags: ['功能', '导入'],
        techStack: ['React', 'xlsx'],
        designNotes: '支持字段映射和数据校验',
        children: [
          {
            id: 'p1-2-1',
            title: 'Excel解析',
            description: '解析xlsx格式文件',
            status: 'completed',
            priority: 'high',
            tags: ['功能'],
            techStack: ['xlsx'],
            designNotes: '支持多sheet和日期格式',
            children: [],
          },
          {
            id: 'p1-2-2',
            title: '字段映射',
            description: '用户自定义Excel列与系统字段的映射关系',
            status: 'pending',
            priority: 'medium',
            tags: ['功能'],
            techStack: ['React'],
            designNotes: '拖拽式映射操作',
            children: [],
          },
        ],
      },
      {
        id: 'p1-3',
        title: '数据导出功能',
        description: '支持将客户数据导出为Excel格式',
        status: 'pending',
        priority: 'medium',
        tags: ['功能', '导出'],
        techStack: ['xlsx'],
        designNotes: '支持自定义导出字段',
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
    tags: ['项目', 'AI'],
    techStack: ['Next.js', 'OpenAI API', 'WebSocket'],
    designNotes: '简洁现代风格，类ChatGPT布局',
    expanded: true,
    children: [
      {
        id: 'p2-1',
        title: '深色模式切换',
        description: '实现主题切换功能，支持亮色/深色模式',
        status: 'in_progress',
        priority: 'medium',
        tags: ['功能', 'UI'],
        techStack: ['React', 'Tailwind CSS'],
        designNotes: '深色主题采用中性灰配色，保护眼睛',
        children: [
          {
            id: 'p2-1-1',
            title: '主题切换组件',
            description: '开发可复用的主题切换开关',
            status: 'in_progress',
            priority: 'medium',
            tags: ['组件', 'UI'],
            techStack: ['React', 'Tailwind'],
            designNotes: '切换动画流畅',
            children: [],
          },
          {
            id: 'p2-1-2',
            title: '主题持久化',
            description: '保存用户的主题偏好到localStorage',
            status: 'pending',
            priority: 'low',
            tags: ['功能', '存储'],
            techStack: ['localStorage'],
            designNotes: '刷新页面后保持主题设置',
            children: [],
          },
        ],
      },
      {
        id: 'p2-2',
        title: '移动端适配',
        description: '优化移动端界面和交互',
        status: 'pending',
        priority: 'medium',
        tags: ['Bug', '移动端'],
        techStack: ['CSS', 'React'],
        designNotes: '移动端采用汉堡菜单',
        children: [
          {
            id: 'p2-2-1',
            title: '汉堡菜单实现',
            description: '实现移动端汉堡菜单展开/收起',
            status: 'pending',
            priority: 'medium',
            tags: ['功能', '移动端'],
            techStack: ['React', 'CSS动画'],
            designNotes: '菜单从左侧滑入，带遮罩层',
            children: [],
          },
          {
            id: 'p2-2-2',
            title: '响应式布局修复',
            description: '修复移动端页面布局错位问题',
            status: 'pending',
            priority: 'low',
            tags: ['Bug', 'CSS'],
            techStack: ['Tailwind CSS'],
            designNotes: '确保各屏幕尺寸下布局正常',
            children: [],
          },
        ],
      },
      {
        id: 'p2-3',
        title: '对话历史记录',
        description: '保存和展示用户的对话历史',
        status: 'pending',
        priority: 'high',
        tags: ['功能', '存储'],
        techStack: ['MongoDB', 'React'],
        designNotes: '左侧栏显示历史记录列表',
        children: [],
      },
    ],
  },
];