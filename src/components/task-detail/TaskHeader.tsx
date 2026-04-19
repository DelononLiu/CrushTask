import { Task } from '@/types/task';

interface TaskHeaderProps {
  task: Task;
  viewMode: 'list' | 'detail';
  checkedItems: Record<number, boolean>;
  onToggleCheck: (index: number) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAcceptance?: () => void;
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

export default function TaskHeader({ task, viewMode, checkedItems, onToggleCheck, onEdit, onDelete, onAcceptance }: TaskHeaderProps) {
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

  // Compact detail view header
  const totalCount = task.acceptanceCriteria?.length || 0;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="p-2 lg:p-3 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
      {/* Single row: title, status, priority, actions on right */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h1 className="text-base lg:text-xl font-semibold text-white">{task.title}</h1>
          <span className={`px-0.5 py-0.5 text-[8px] font-medium border ${statusColors[task.status]}`}>{statusLabels[task.status]}</span>
          <span className="px-0.5 py-0.5 text-[8px] font-medium bg-gray-500/20 text-gray-400 border border-gray-500/50">{priorityLabels[task.priority]}</span>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button onClick={onEdit} className="px-1.5 py-0.5 text-[10px] bg-gray-700 text-gray-300 hover:bg-gray-600">✏️ 编辑</button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="px-1.5 py-0.5 text-[10px] bg-gray-700 text-gray-300 hover:bg-gray-600">🗑️ 删除</button>
          )}
          {onAcceptance && (
            <button onClick={onAcceptance} className="px-1.5 py-0.5 text-[10px] bg-blue-600 text-white hover:bg-blue-700">✅ 验收</button>
          )}
        </div>
      </div>
      
      {/* Goal - core info */}
      {task.goal && (
        <div className="text-xs text-gray-400 mb-1">
          <span className="text-gray-500">目标:</span> {task.goal}
        </div>
      )}
      
      {/* Compact info row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-500">
        {task.input && <span><span className="text-gray-600">输入:</span> {task.input}</span>}
        {task.output && <span><span className="text-gray-600">输出:</span> {task.output}</span>}
        {task.context?.techStack?.length && <span><span className="text-gray-600">栈:</span> {task.context.techStack.slice(0, 2).join(', ')}{task.context.techStack.length > 2 ? '...' : ''}</span>}
      </div>
      
      {/* Compact acceptance criteria */}
      {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
        <div className="mt-1">
          <span className="text-[10px] text-gray-500">验收({completedCount}/{totalCount}): </span>
          <div className="inline-flex flex-wrap gap-1">
            {task.acceptanceCriteria.slice(0, 3).map((criteria, index) => (
              <span 
                key={index} 
                onClick={() => onToggleCheck(index)}
                className={`px-1 py-0.5 text-[9px] cursor-pointer ${
                  checkedItems[index] ? 'bg-green-600/20 text-green-400 line-through' : 'bg-gray-700 text-gray-400'
                }`}
              >
                {checkedItems[index] ? '✓' : '○'}
              </span>
            ))}
            {task.acceptanceCriteria.length > 3 && <span className="text-[9px] text-gray-500">+{task.acceptanceCriteria.length - 3}</span>}
          </div>
        </div>
      )}
    </div>
  );
}