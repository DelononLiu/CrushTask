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