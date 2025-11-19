import { useState } from 'react';
import { useTask, useTaskComments, useCreateComment, useUpdateTask, useBoard, useTaskNotification, Task, TaskColumn } from '../../lib/api/team';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { X, Calendar, User, Mail } from 'lucide-react';

interface TaskModalProps {
  taskId: string;
  onClose: () => void;
  onTaskUpdate?: () => void;
}

export default function TaskModal({ taskId, onClose, onTaskUpdate }: TaskModalProps) {
  const { data: task, isLoading } = useTask(taskId);
  const { data: comments } = useTaskComments(taskId);
  const createComment = useCreateComment();
  const updateTask = useUpdateTask();
  const taskNotification = useTaskNotification();
  const [commentText, setCommentText] = useState('');
  const [notificationError, setNotificationError] = useState<string>('');
  const [notificationSuccess, setNotificationSuccess] = useState<string>('');
  
  // Load board to get available columns
  const boardId = task?.boardId || '';
  const { data: board } = useBoard(boardId);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await createComment.mutateAsync({
        taskId,
        data: { szoveg: commentText },
      });
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleStatusChange = async (newStatus: Task['allapot']) => {
    if (!task || task.allapot === newStatus) return;
    
    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: {
          allapot: newStatus,
        },
      });
      // Notify parent component to refresh board
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      TODO: 'Teendő',
      IN_PROGRESS: 'Folyamatban',
      IN_REVIEW: 'Áttekintés alatt',
      DONE: 'Kész',
      BLOCKED: 'Blokkolva',
      CANCELLED: 'Törölve',
    };
    return labels[status] || status;
  };

  const handleSendNotification = async () => {
    if (!task?.assignedToId) {
      setNotificationError('Nincs hozzárendelt felhasználó a feladathoz');
      return;
    }

    setNotificationError('');
    setNotificationSuccess('');

    try {
      const result = await taskNotification.mutateAsync({
        taskId: task.id,
        userId: task.assignedToId,
      });

      // Open mailto link
      window.location.href = result.mailtoUrl;
      
      setNotificationSuccess('Email kliens megnyitva!');
      setTimeout(() => {
        setNotificationSuccess('');
      }, 3000);
    } catch (error: any) {
      setNotificationError(error.response?.data?.message || 'Hiba történt az értesítés küldése során');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">Betöltés...</div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.cim}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              {task.assignedTo && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{task.assignedTo.nev}</span>
                </div>
              )}
              {task.hataridoDatum && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(task.hataridoDatum), 'yyyy. MMMM d.', { locale: hu })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Állapot:</span>
                {board?.columns && board.columns.length > 0 ? (
                  <select
                    value={task.allapot}
                    onChange={(e) => handleStatusChange(e.target.value as Task['allapot'])}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    disabled={updateTask.isPending}
                  >
                    {board.columns.map((column: TaskColumn) => (
                      <option key={column.id} value={column.allapot}>
                        {column.nev}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium">
                    {getStatusLabel(task.allapot)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {task.assignedToId && (
              <button
                onClick={handleSendNotification}
                disabled={taskNotification.isPending}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                title="Email értesítés küldése"
              >
                <Mail className="w-4 h-4" />
                Értesítés küldése
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {notificationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {notificationError}
            </div>
          )}

          {notificationSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
              {notificationSuccess}
            </div>
          )}

          {task.leiras && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Leírás</h3>
              <p className="text-gray-700">{task.leiras}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hozzászólások</h3>
            <div className="space-y-4 mb-4">
              {comments?.map((comment: any) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {comment.user?.nev || 'Ismeretlen'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.createdAt), 'yyyy. MMMM d. HH:mm', { locale: hu })}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.szoveg}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Írj hozzászólást..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim() || createComment.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Küldés
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

