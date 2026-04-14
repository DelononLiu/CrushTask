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
}

export const initialTasks: Task[] = [
  {
    id: '1',
    title: '项目启动',
    description: '完成项目初始化和团队组建，确定项目整体方向和目标',
    status: 'completed',
    priority: 'high',
    tags: ['项目管理', '初始化'],
    techStack: ['Next.js', 'TypeScript', 'Tailwind'],
    designNotes: '采用简洁现代的设计风格，深色主题为主',
    dueDate: '2024-01-15',
    expanded: true,
    children: [
      {
        id: '1-1',
        title: '需求分析',
        description: '收集并整理用户需求，编写需求文档，与 stakeholders 确认',
        status: 'completed',
        priority: 'high',
        tags: ['需求', '文档'],
        techStack: ['Figma', 'Notion'],
        designNotes: '收集各方的需求和期望',
        children: [],
      },
      {
        id: '1-2',
        title: '技术选型',
        description: '确定技术栈和开发工具，评估各技术方案的优劣',
        status: 'completed',
        priority: 'medium',
        tags: ['技术', '架构'],
        techStack: ['Next.js', 'React', 'TypeScript'],
        designNotes: '选择成熟稳定的开源技术',
        children: [],
      },
    ],
  },
  {
    id: '2',
    title: '开发阶段',
    description: '完成核心功能开发，包括前后端实现和接口对接',
    status: 'in_progress',
    priority: 'high',
    tags: ['开发', '核心功能'],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    designNotes: '组件化设计，强调可复用性和可维护性',
    dueDate: '2024-02-28',
    expanded: true,
    children: [
      {
        id: '2-1',
        title: '前端开发',
        description: '实现用户界面和交互功能，确保良好的用户体验',
        status: 'in_progress',
        priority: 'high',
        tags: ['前端', 'UI'],
        techStack: ['React', 'Tailwind CSS', 'Framer Motion'],
        designNotes: '采用组件化设计，深色主题，响应式布局',
        children: [
          {
            id: '2-1-1',
            title: '组件开发',
            description: '开发可复用组件库，包括按钮、输入框、卡片等',
            status: 'pending',
            priority: 'medium',
            tags: ['组件', 'UI库'],
            techStack: ['React', 'Tailwind'],
            designNotes: '统一的视觉风格，良好的交互反馈',
            children: [],
          },
          {
            id: '2-1-2',
            title: '页面开发',
            description: '实现各个业务页面，包括首页、详情页、设置页等',
            status: 'pending',
            priority: 'high',
            tags: ['页面', '业务'],
            techStack: ['Next.js', 'React'],
            designNotes: '清晰的页面结构和导航',
            children: [],
          },
        ],
      },
      {
        id: '2-2',
        title: '后端开发',
        description: '实现业务逻辑和接口，提供稳定的数据服务',
        status: 'pending',
        priority: 'high',
        tags: ['后端', 'API'],
        techStack: ['Node.js', 'Express', 'PostgreSQL'],
        designNotes: 'RESTful API 设计，清晰的接口文档',
        children: [],
      },
    ],
  },
  {
    id: '3',
    title: '测试阶段',
    description: '完成测试和 bug 修复，确保产品质量',
    status: 'pending',
    priority: 'high',
    tags: ['测试', 'QA'],
    techStack: ['Jest', 'Playwright', 'Cypress'],
    designNotes: '完整的测试覆盖，包括单元测试和集成测试',
    dueDate: '2024-03-15',
    children: [
      {
        id: '3-1',
        title: '单元测试',
        description: '编写单元测试用例，覆盖核心业务逻辑',
        status: 'pending',
        priority: 'medium',
        tags: ['测试', '单元'],
        techStack: ['Jest', 'React Testing Library'],
        designNotes: '高覆盖率的单元测试',
        children: [],
      },
      {
        id: '3-2',
        title: '集成测试',
        description: '进行系统集成测试，验证各模块协作',
        status: 'pending',
        priority: 'medium',
        tags: ['测试', '集成'],
        techStack: ['Playwright', 'Cypress'],
        designNotes: '端到端测试，覆盖关键用户流程',
        children: [],
      },
    ],
  },
  {
    id: '4',
    title: '上线部署',
    description: '完成项目上线，配置CI/CD和监控',
    status: 'pending',
    priority: 'high',
    tags: ['部署', '运维'],
    techStack: ['Docker', 'Vercel', 'GitHub Actions'],
    designNotes: '自动化部署流程，确保稳定可靠',
    dueDate: '2024-03-30',
    children: [],
  },
];