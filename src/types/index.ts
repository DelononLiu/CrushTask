export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  children: Task[];
  expanded?: boolean;
}

export const initialTasks: Task[] = [
  {
    id: '1',
    title: '项目启动',
    description: '完成项目初始化和团队组建',
    status: 'completed',
    expanded: true,
    children: [
      {
        id: '1-1',
        title: '需求分析',
        description: '收集并整理用户需求，编写需求文档',
        status: 'completed',
        children: [],
      },
      {
        id: '1-2',
        title: '技术选型',
        description: '确定技术栈和开发工具',
        status: 'completed',
        children: [],
      },
    ],
  },
  {
    id: '2',
    title: '开发阶段',
    description: '完成核心功能开发',
    status: 'in_progress',
    expanded: true,
    children: [
      {
        id: '2-1',
        title: '前端开发',
        description: '实现用户界面和交互功能',
        status: 'in_progress',
        children: [
          {
            id: '2-1-1',
            title: '组件开发',
            description: '开发可复用组件库',
            status: 'pending',
            children: [],
          },
          {
            id: '2-1-2',
            title: '页面开发',
            description: '实现各个业务页面',
            status: 'pending',
            children: [],
          },
        ],
      },
      {
        id: '2-2',
        title: '后端开发',
        description: '实现业务逻辑和接口',
        status: 'pending',
        children: [],
      },
    ],
  },
  {
    id: '3',
    title: '测试阶段',
    description: '完成测试和bug修复',
    status: 'pending',
    children: [
      {
        id: '3-1',
        title: '单元测试',
        description: '编写单元测试用例',
        status: 'pending',
        children: [],
      },
      {
        id: '3-2',
        title: '集成测试',
        description: '进行系统集成测试',
        status: 'pending',
        children: [],
      },
    ],
  },
  {
    id: '4',
    title: '上线部署',
      description: '完成项目上线',
    status: 'pending',
    children: [],
  },
];