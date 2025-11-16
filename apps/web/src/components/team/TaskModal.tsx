import { useState } from 'react';
import { useTask, useTaskComments, useCreateComment } from '../../lib/api/team';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { X, Calendar, User } from 'lucide-react';

interface TaskModalProps {
  taskId: string;
  onClose: () => void;
}

export default function TaskModal({ taskId, onClose }: TaskModalProps) {
  const { data: task, isLoading } = useTask(taskId);
  const { data: comments } = useTaskComments(taskId);
  const createComment = useCreateComment();
  const [commentText, setCommentText] = useState('');

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
            <div className="flex items-center gap-4 text-sm text-gray-600">
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
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
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

