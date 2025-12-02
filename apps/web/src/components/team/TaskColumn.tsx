import { TaskColumn as TaskColumnType, Task } from '../../lib/api/team';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface TaskColumnProps {
  column: TaskColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  boardColor?: string;
  currentUserId?: string;
  showOnlyMyTasks?: boolean;
}

export default function TaskColumn({ column, tasks, onTaskClick, boardColor, currentUserId, showOnlyMyTasks }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  let columnTasks = tasks.filter((task) => task.allapot === column.allapot);
  
  // Filter to show only tasks assigned to current user if showOnlyMyTasks is true
  if (showOnlyMyTasks && currentUserId) {
    columnTasks = columnTasks.filter((task) => task.assignedToId === currentUserId);
  }
  
  const color = boardColor || '#3B82F6';

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          {column.nev}
        </h3>
        <span className="text-sm text-gray-500">
          {columnTasks.length}
          {column.limit && ` / ${column.limit}`}
        </span>
      </div>

      <SortableContext
        items={columnTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[200px]">
          {columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
          {columnTasks.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              Nincs feladat
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

