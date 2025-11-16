import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { TaskBoard as TaskBoardType, Task } from '../../lib/api/team';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import { useMoveTask } from '../../lib/api/team';

interface TaskBoardProps {
  board: TaskBoardType;
  onTaskClick: (task: Task) => void;
}

export default function TaskBoard({ board, onTaskClick }: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const moveTask = useMoveTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = board.tasks?.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const task = board.tasks?.find((t) => t.id === active.id);
    
    // Check if dropped on a column
    const column = board.columns?.find((c) => c.id === over.id);
    if (column && task) {
      // Don't move if already in the same column
      if (task.allapot === column.allapot) return;

      // Calculate new position (at the end of the column)
      const columnTasks = board.tasks?.filter((t) => t.allapot === column.allapot) || [];
      const newPosition = columnTasks.length;

      try {
        await moveTask.mutateAsync({
          id: task.id,
          data: {
            boardId: board.id,
            allapot: column.allapot as Task['allapot'],
            position: newPosition,
          },
        });
      } catch (error) {
        console.error('Failed to move task:', error);
      }
      return;
    }

    // Check if dropped on another task (reorder within same column)
    const overTask = board.tasks?.find((t) => t.id === over.id);
    if (overTask && task && task.allapot === overTask.allapot) {
      // Reorder within same column
      const columnTasks = board.tasks?.filter((t) => t.allapot === task.allapot) || [];
      const oldIndex = columnTasks.findIndex((t) => t.id === task.id);
      const newIndex = columnTasks.findIndex((t) => t.id === overTask.id);

      if (oldIndex !== newIndex) {
        try {
          await moveTask.mutateAsync({
            id: task.id,
            data: {
              boardId: board.id,
              allapot: task.allapot,
              position: newIndex,
            },
          });
        } catch (error) {
          console.error('Failed to reorder task:', error);
        }
      }
    }
  };

  const sortedColumns = board.columns?.sort((a, b) => a.pozicio - b.pozicio) || [];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {sortedColumns.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={board.tasks || []}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

