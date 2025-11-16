import { Task } from '../../lib/api/team';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { Calendar, User, Tag, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };

  const isOverdue = task.hataridoDatum && new Date(task.hataridoDatum) < new Date() && task.allapot !== 'DONE';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow relative ${
        isOverdue ? 'border-red-300' : ''
      } ${isDragging ? 'z-50' : ''}`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div onClick={onClick} className="cursor-pointer pl-6">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm flex-1">{task.cim}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.prioritas]}`}>
          {task.prioritas}
        </span>
      </div>

      {task.leiras && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.leiras}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-500 mt-3">
        {task.assignedTo && (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{task.assignedTo.nev}</span>
          </div>
        )}

        {task.hataridoDatum && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
            <Calendar className="w-3 h-3" />
            <span>
              {format(new Date(task.hataridoDatum), 'MMM d', { locale: hu })}
            </span>
          </div>
        )}

        {task._count && task._count.comments > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{task._count.comments}</span>
          </div>
        )}
      </div>

      {task.board && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">{task.board.nev}</span>
        </div>
      )}
      </div>
    </div>
  );
}
