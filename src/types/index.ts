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
    title: '用户登录功能',
    description: '实现邮箱密码登录和第三方登录功能',
    status: 'completed',
    priority: 'high',
    tags: ['功能', '认证'],
    techStack: ['NextAuth', 'React', 'JWT'],
    designNotes: '简洁的登录表单，支持记住密码',
    expanded: true,
    children: [
      {
        id: '1-1',
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
        id: '1-2',
        title: 'GitHub OAuth登录',
        description: '集成GitHub第三方登录',
        status: 'completed',
        priority: 'medium',
        tags: ['功能', 'OAuth'],
        techStack: ['NextAuth.js'],
        designNotes: '使用NextAuth实现GitHub登录',
        children: [],
      },
    ],
  },
  {
    id: '2',
    title: '深色模式切换',
    description: '实现主题切换功能，支持亮色/深色模式',
    status: 'in_progress',
    priority: 'medium',
    tags: ['功能', 'UI'],
    techStack: ['React', 'Tailwind CSS', 'localStorage'],
    designNotes: '深色主题采用中性灰配色，保护眼睛',
    expanded: true,
    children: [
      {
        id: '2-1',
        title: '主题切换组件',
        description: '开发可复用的主题切换开关',
        status: 'in_progress',
        priority: 'medium',
        tags: ['组件', 'UI'],
        techStack: ['React', 'Tailwind'],
        designNotes: '切换动画流畅，支持系统主题跟随',
        children: [],
      },
      {
        id: '2-2',
        title: '主题持久化',
        description: '保存用户的主题偏好到localStorage',
        status: 'pending',
        priority: 'low',
        tags: ['功能', '存储'],
        techStack: ['localStorage', 'React Context'],
        designNotes: '刷新页面后保持主题设置',
        children: [],
      },
    ],
  },
  {
    id: '3',
    title: '移动端导航优化',
    description: '优化移动端导航菜单和手势操作',
    status: 'pending',
    priority: 'medium',
    tags: ['Bug', '移动端'],
    techStack: ['CSS', 'React'],
    designNotes: '移动端采用汉堡菜单，滑动手势关闭',
    children: [
      {
        id: '3-1',
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
        id: '3-2',
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
    id: '4',
    title: '数据导出功能',
    description: '支持将任务数据导出为JSON/CSV格式',
    status: 'pending',
    priority: 'low',
    tags: ['功能', '导出'],
    techStack: ['JavaScript', 'FileSaver.js'],
    designNotes: '导出按钮放置在设置页面',
    children: [],
  },
];