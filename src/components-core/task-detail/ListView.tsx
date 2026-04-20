import { Task } from '@/components-core/types';

interface ListViewProps {
  task: Task;
  parentTasks: Task[];
  onSelectTask?: (task: Task) => void;
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

const getStatusDotColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    rejected: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
};

export default function ListView({ task, parentTasks, onSelectTask }: ListViewProps) {
  const groupedTasks: Record<string, Task[]> = {
    in_progress: [],
    pending: [],
    completed: [],
  };

  parentTasks.forEach(t => {
    if (groupedTasks[t.status]) {
      groupedTasks[t.status].push(t);
    } else if (t.status === 'rejected') {
      groupedTasks.pending.push(t);
    }
  });

  const groupOrder = ['in_progress', 'pending', 'completed'];

  return (
    <div className="flex-1 overflow-y-auto p-3 lg:p-4">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h2 className="text-base lg:text-lg font-semibold text-white">{task.title}</h2>
      </div>
      {groupOrder.map(status => (
        groupedTasks[status].length > 0 && (
          <div key={status} className="mb-4 lg:mb-6">
            <div className="flex items-center gap-2 mb-2 lg:mb-3">
              <span className={`w-2 h-2 rounded-full ${getStatusDotColor(status)}`}></span>
              <span className="text-sm font-medium text-gray-300">{statusLabels[status]}</span>
              <span className="text-xs text-gray-500">({groupedTasks[status].length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3">
              {groupedTasks[status].map(t => (
                <div 
                  key={t.id} 
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-blue-500 cursor-pointer transition-colors"
                  onDoubleClick={() => onSelectTask?.(t)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusDotColor(t.status)}`}></span>
                    <span className="text-sm font-medium text-gray-300">{t.title}</span>
                  </div>
                  <div className="text-xs text-gray-500">{t.module}{t.subFeature && ` → ${t.subFeature}`}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${statusColors[t.status]}`}>{statusLabels[t.status]}</span>
                    <span className="text-[10px] text-gray-500">{priorityLabels[t.priority]}优先级</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      {parentTasks.length === 0 && (
        <div className="text-center text-gray-500 py-8">暂无子任务</div>
      )}
    </div>
  );
}