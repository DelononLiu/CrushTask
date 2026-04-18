import { Task } from '../types';

interface TreeNodeProps {
  task: Task;
  level: number;
  selectedTaskId: string | null;
  onSelectTask: (task: Task) => void;
  statusColors: Record<string, string>;
  levels: { PROJECT: number; MODULE: number; SUBFEATURE: number; TASK: number };
}

const getNodeIcon = (task: Task, level: number, levels: TreeNodeProps['levels']): string => {
  if (task.nodeType === 'root') {
    if (task.title === 'CrushTask') return '📦';
    return '📋';
  }
  if (task.nodeType === 'category' || level === levels.MODULE) {
    return '📂';
  }
  if (level === levels.SUBFEATURE) {
    return '🔧';
  }
  if (level === levels.TASK || task.nodeType === 'task') {
    return task.status === 'completed' ? '✅' : '📝';
  }
  return '📦';
};

export default function TreeNode({ task, level, selectedTaskId, onSelectTask, statusColors, levels }: TreeNodeProps) {
  const hasChildren = task.children && task.children.length > 0;
  const isSelected = task.id === selectedTaskId;
  const isTask = level === levels.TASK || task.nodeType === 'task';

  const handleClick = () => {
    onSelectTask(task);
  };

  return (
    <div key={task.id}>
      <div
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
          isSelected
            ? 'bg-blue-600/30 border-l-2 border-blue-500' 
            : 'hover:bg-gray-800/50 border-l-2 border-transparent'
        }`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <span className={`text-xs transition-transform ${task.expanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
        )}
        {!hasChildren && <span className="w-4" />}
        
        <span className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
        
        <span className={`text-sm truncate ${
          isTask
            ? isSelected 
              ? 'text-[#165DFF] font-medium' 
              : 'text-[#165DFF]'
            : level === levels.PROJECT
              ? 'text-white font-medium'
              : 'text-gray-400'
        }`}>
          {getNodeIcon(task, level, levels)} {task.title}
        </span>
        
        {isSelected && isTask && <span className="ml-auto text-[#165DFF]">▶</span>}
      </div>

      {hasChildren && task.expanded && (
        <div>
          {task.children.map(child => (
            <TreeNode 
              key={child.id} 
              task={child} 
              level={level + 1} 
              selectedTaskId={selectedTaskId}
              onSelectTask={onSelectTask}
              statusColors={statusColors}
              levels={levels}
            />
          ))}
        </div>
      )}
    </div>
  );
}