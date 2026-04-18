import { Task } from '@/types/task';

interface TaskHeaderProps {
  task: Task;
  viewMode: 'list' | 'detail';
  onBack: () => void;
  checkedItems: Record<number, boolean>;
  onToggleCheck: (index: number) => void;
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

export default function TaskHeader({ task, viewMode, onBack, checkedItems, onToggleCheck }: TaskHeaderProps) {
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

  // Detail view header with task info
  const totalCount = task.acceptanceCriteria?.length || 0;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="p-3 lg:p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 overflow-y-auto max-h-[35vh]">
      {/* Top row: back button + status */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">← 返回</button>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[task.status]}`}>{statusLabels[task.status]}</span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/50">{priorityLabels[task.priority]}优先级</span>
        </div>
      </div>
      
      {/* Title and path */}
      <h1 className="text-base lg:text-xl font-semibold text-white">{task.title}</h1>
      <div className="text-xs lg:text-sm text-gray-500 mt-1 mb-3">{task.module}{task.subFeature ? ` → ${task.subFeature}` : ''}</div>
      
      {/* Task info grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-gray-500 mb-1">任务目标</div>
          <div className="text-gray-200 line-clamp-2">{task.goal || '-'}</div>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-gray-500 mb-1">输入</div>
          <div className="text-gray-200 line-clamp-2">{task.input || '-'}</div>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-gray-500 mb-1">输出</div>
          <div className="text-gray-200 line-clamp-2">{task.output || '-'}</div>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-gray-500 mb-1">技术栈</div>
          <div className="text-gray-200 line-clamp-2">{task.context?.techStack?.join(', ') || '-'}</div>
        </div>
      </div>
      
      {/* Acceptance criteria */}
      {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1">验收标准 ({completedCount}/{totalCount})</div>
          <div className="flex flex-wrap gap-1">
            {task.acceptanceCriteria.map((criteria, index) => (
              <span 
                key={index} 
                onClick={() => onToggleCheck(index)}
                className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                  checkedItems[index] 
                    ? 'bg-green-600/20 text-green-400 line-through' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {checkedItems[index] ? '✓' : '○'} {criteria}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}