import { Task } from '../types';

interface TreeNodeProps {
  task: Task;
  level: number;
  selectedTaskId: string | null;
  onSelectTask: (task: Task) => void;
  statusColors: Record<string, string>;
  levels: { PROJECT: number; MODULE: number; SUBFEATURE: number; TASK: number };
}

const getNodeIcon = (task: Task, isExpanded: boolean): { icon: string; iconColor: string } => {
  if (task.nodeType === 'root') {
    return { icon: '📦', iconColor: 'text-yellow-400' };
  }
  const hasChildren = task.children && task.children.length > 0;
  if (hasChildren) {
    return isExpanded 
      ? { icon: '📂', iconColor: 'text-gray-400' }
      : { icon: '📁', iconColor: 'text-gray-400' };
  }
  if (task.status === 'completed') {
    return { icon: '✓', iconColor: 'text-green-500' };
  }
  return { icon: '📄', iconColor: 'text-gray-400' };
};

export default function TreeNode({ task, level, selectedTaskId, onSelectTask, statusColors, levels }: TreeNodeProps) {
  const hasChildren = task.children && task.children.length > 0;
  const isSelected = task.id === selectedTaskId;
  const isTask = level === levels.TASK || task.nodeType === 'task';
  const isExpanded = task.expanded ?? false;
  const nodeInfo = getNodeIcon(task, isExpanded);

  const handleClick = () => {
    onSelectTask(task);
  };

  return (
    <div key={task.id}>
      <div
        className={`flex items-center gap-1.5 px-1.5 py-1.5 cursor-pointer transition-colors ${
          isSelected
            ? 'bg-[#37373D] border-l-2 border-gray-500' 
            : 'hover:bg-[#2A2D2E] border-l-2 border-transparent'
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <span className={`w-4 text-xs text-gray-400 transition-transform ${isExpanded ? '-rotate-90' : ''}`}>
            ▶
          </span>
        ) : (
          <span className="w-4" />
        )}
        
        <span className={`text-sm ${nodeInfo.iconColor}`}>
          {nodeInfo.icon}
        </span>
        
        <span className={`text-sm truncate ${
          isTask
            ? isSelected 
              ? 'text-gray-200 font-normal' 
              : 'text-gray-400'
            : level === levels.PROJECT
              ? 'text-white font-medium'
              : 'text-gray-300'
        }`}>
          {task.title}
        </span>
      </div>

      {hasChildren && isExpanded && (
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