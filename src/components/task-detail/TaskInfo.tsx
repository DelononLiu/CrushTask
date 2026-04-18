import { Task } from '@/types/task';

interface TaskInfoProps {
  task: Task;
  checkedItems: Record<number, boolean>;
  onToggleCheck: (index: number) => void;
}

export default function TaskInfo({ task, checkedItems, onToggleCheck }: TaskInfoProps) {
  const totalCount = task.acceptanceCriteria?.length || 0;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">任务目标</div>
          <div className="text-sm text-gray-200 line-clamp-2">{task.goal || '暂无'}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">输入</div>
          <div className="text-sm text-gray-200 line-clamp-2">{task.input || '暂无'}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">输出</div>
          <div className="text-sm text-gray-200 line-clamp-2">{task.output || '暂无'}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">约束条件</div>
          <div className="text-sm text-gray-200 line-clamp-2">{task.constraints || '暂无'}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">技术栈</div>
          <div className="text-sm text-gray-200">
            {task.context?.techStack?.join(', ') || '暂无'}
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">相关文件</div>
          <div className="text-sm text-gray-200 line-clamp-2">
            {task.context?.relatedFiles?.join(', ') || '暂无'}
          </div>
        </div>
      </div>
      {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
        <div className="mt-4 bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-2">验收标准 ({completedCount}/{totalCount})</div>
          <div className="flex flex-wrap gap-2">
            {(task.acceptanceCriteria || []).map((criteria, index) => (
              <span 
                key={index} 
                onClick={() => onToggleCheck(index)}
                className={`px-2 py-1 rounded text-xs cursor-pointer ${
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