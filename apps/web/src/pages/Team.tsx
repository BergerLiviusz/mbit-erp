import { useState, useEffect } from 'react';
import { useBoards, useBoard, useDashboardStats, Task, TaskBoard } from '../lib/api/team';
import TaskBoardComponent from '../components/team/TaskBoard';
import TaskModal from '../components/team/TaskModal';
import { Plus } from 'lucide-react';

export default function Team() {
  const { data: boards } = useBoards();
  const { data: stats } = useDashboardStats();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedBoard = boards?.find((b: TaskBoard) => b.id === selectedBoardId) || boards?.[0];
  const boardIdToLoad = selectedBoard?.id || '';
  const { data: boardDetails } = useBoard(boardIdToLoad);

  useEffect(() => {
    if (boards && boards.length > 0 && !selectedBoardId) {
      const defaultBoard = boards.find((b: TaskBoard) => b.isDefault) || boards[0];
      setSelectedBoardId(defaultBoard.id);
    }
  }, [boards, selectedBoardId]);

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Csapat kommunikáció</h1>

        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Összes feladat</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Teendők</div>
              <div className="text-2xl font-bold text-gray-900">{stats.byStatus?.TODO || 0}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Folyamatban</div>
              <div className="text-2xl font-bold text-blue-600">{stats.byStatus?.IN_PROGRESS || 0}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Lejárt</div>
              <div className="text-2xl font-bold text-red-600">{stats.overdue || 0}</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {boards?.map((board: TaskBoard) => (
              <button
                key={board.id}
                onClick={() => setSelectedBoardId(board.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedBoardId === board.id || (!selectedBoardId && board.isDefault)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {board.nev}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Új feladat
          </button>
        </div>
      </div>

      {boardDetails && (
        <div className="bg-white rounded-lg shadow p-6">
          <TaskBoardComponent
            board={boardDetails}
            onTaskClick={handleTaskClick}
          />
        </div>
      )}

      {selectedTaskId && (
        <TaskModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}

