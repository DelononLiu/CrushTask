import { Task } from '@/types/task';

interface TaskHeaderProps {
  task: Task;
  viewMode: 'list' | 'detail';
  onBack: () => void;
}

const statusLabels: Record<string, string> = {
  pending: '计划',
  in_progress: '正在进行',
  completed: '完成',
  rejected: '已驳回',
};

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  completed: 'bg-green-500/20 text-green-400 border-green-500/50',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const priorityLabels: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

export default function TaskHeader({ task, viewMode, onBack }: TaskHeaderProps) {
  if (viewMode === 'list') {
    return (
      <div className="p-3 lg:p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-base lg:text-lg">📂</span>
          <h1 className="text-base lg:text-xl font-semibold text-white">{task.title}</h1>
        </div>
        <div className="text-xs lg:text-sm text-gray-500 mt-1">{task.module}{task.subFeature ? ` → ${task.subFeature}` : ''}</div>
      </div>
    );
  }

  return (
    <div className="p-3 lg:p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">← 返回</button>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[task.status]}`}>{statusLabels[task.status]}</span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/50">{priorityLabels[task.priority]}优先级</span>
      </div>
      <h1 className="text-base lg:text-xl font-semibold text-white">{task.title}</h1>
      <div className="text-xs lg:text-sm text-gray-500 mt-1">{task.module}{task.subFeature ? ` → ${task.subFeature}` : ''}</div>
    </div>
  );
}