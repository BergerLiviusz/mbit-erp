import { useState, useEffect } from 'react';
import { useBoards, useBoard, useDashboardStats, useCreateTask, useCreateBoard, Task, TaskBoard, CreateTaskDto } from '../lib/api/team';
import TaskBoardComponent from '../components/team/TaskBoard';
import TaskModal from '../components/team/TaskModal';
import Modal from '../components/Modal';
import { Plus, Settings } from 'lucide-react';
import axios from '../lib/axios';

interface User {
  id: string;
  email: string;
  nev: string;
  aktiv: boolean;
}

export default function Team() {
  const { data: boards, isLoading: boardsLoading } = useBoards();
  const { data: stats } = useDashboardStats();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createTask = useCreateTask();
  const createBoard = useCreateBoard();

  const selectedBoard = boards?.find((b: TaskBoard) => b.id === selectedBoardId) || boards?.[0];
  const boardIdToLoad = selectedBoard?.id || '';
  const { data: boardDetails } = useBoard(boardIdToLoad);

  const [taskFormData, setTaskFormData] = useState<CreateTaskDto>({
    cim: '',
    leiras: '',
    allapot: 'TODO',
    prioritas: 'MEDIUM',
    hataridoDatum: '',
    assignedToId: '',
    boardId: '',
    tags: '',
  });

  const [boardFormData, setBoardFormData] = useState({
    nev: '',
    leiras: '',
    szin: '#3B82F6',
  });

  useEffect(() => {
    if (boards && boards.length > 0 && !selectedBoardId) {
      const defaultBoard = boards.find((b: TaskBoard) => b.isDefault) || boards[0];
      setSelectedBoardId(defaultBoard.id);
    }
  }, [boards, selectedBoardId]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get('/api/system/users?skip=0&take=100');
      if (response.data.items) {
        setUsers(response.data.items.filter((u: User) => u.aktiv));
      } else if (response.data.data) {
        setUsers(response.data.data.filter((u: User) => u.aktiv));
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
  };

  const handleOpenCreateTaskModal = () => {
    setTaskFormData({
      cim: '',
      leiras: '',
      allapot: 'TODO',
      prioritas: 'MEDIUM',
      hataridoDatum: '',
      assignedToId: '',
      boardId: selectedBoardId || '',
      tags: '',
    });
    setError('');
    setSuccess('');
    setIsCreateTaskModalOpen(true);
  };

  const handleCloseCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
    setError('');
    setSuccess('');
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!taskFormData.cim.trim()) {
      setError('A cím kötelező');
      return;
    }

    if (!taskFormData.boardId) {
      setError('Válasszon board-ot');
      return;
    }

    try {
      await createTask.mutateAsync({
        ...taskFormData,
        assignedToId: taskFormData.assignedToId || undefined,
        hataridoDatum: taskFormData.hataridoDatum || undefined,
        tags: taskFormData.tags || undefined,
        leiras: taskFormData.leiras || undefined,
      });
      setSuccess('Feladat sikeresen létrehozva');
      setTimeout(() => {
        setIsCreateTaskModalOpen(false);
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba a feladat létrehozásakor');
    }
  };

  const handleOpenCreateBoardModal = () => {
    setBoardFormData({
      nev: '',
      leiras: '',
      szin: '#3B82F6',
    });
    setError('');
    setSuccess('');
    setIsCreateBoardModalOpen(true);
  };

  const handleCloseCreateBoardModal = () => {
    setIsCreateBoardModalOpen(false);
    setError('');
    setSuccess('');
  };

  const handleSubmitBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!boardFormData.nev.trim()) {
      setError('A név kötelező');
      return;
    }

    try {
      const newBoard = await createBoard.mutateAsync({
        nev: boardFormData.nev,
        leiras: boardFormData.leiras || undefined,
        szin: boardFormData.szin,
      });
      setSuccess('Board sikeresen létrehozva');
      setTimeout(() => {
        setIsCreateBoardModalOpen(false);
        setSuccess('');
        if (newBoard?.id) {
          setSelectedBoardId(newBoard.id);
        }
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba a board létrehozásakor');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Csapat kommunikáció</h1>
          <div className="flex gap-2">
            <button
              onClick={handleOpenCreateBoardModal}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
              Új board
            </button>
            <button
              onClick={handleOpenCreateTaskModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Új feladat
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Összes feladat</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total || 0}</div>
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

        <div className="flex items-center gap-2 mb-4">
          {boardsLoading ? (
            <div className="text-gray-500">Board-ok betöltése...</div>
          ) : boards && boards.length > 0 ? (
            boards.map((board: TaskBoard) => (
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
            ))
          ) : (
            <div className="text-gray-500">Nincs board. Hozzon létre egy újat!</div>
          )}
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

      {!boardDetails && !boardsLoading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">Válasszon egy board-ot vagy hozzon létre egy újat</p>
        </div>
      )}

      {selectedTaskId && (
        <TaskModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateTaskModalOpen}
        onClose={handleCloseCreateTaskModal}
        title="Új feladat"
        size="lg"
      >
        <form onSubmit={handleSubmitTask}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cím <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={taskFormData.cim}
                onChange={(e) => setTaskFormData({ ...taskFormData, cim: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leírás
              </label>
              <textarea
                value={taskFormData.leiras}
                onChange={(e) => setTaskFormData({ ...taskFormData, leiras: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Állapot <span className="text-red-500">*</span>
                </label>
                <select
                  value={taskFormData.allapot}
                  onChange={(e) => setTaskFormData({ ...taskFormData, allapot: e.target.value as CreateTaskDto['allapot'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="TODO">Teendő</option>
                  <option value="IN_PROGRESS">Folyamatban</option>
                  <option value="IN_REVIEW">Áttekintés alatt</option>
                  <option value="DONE">Kész</option>
                  <option value="BLOCKED">Blokkolva</option>
                  <option value="CANCELLED">Törölve</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioritás <span className="text-red-500">*</span>
                </label>
                <select
                  value={taskFormData.prioritas}
                  onChange={(e) => setTaskFormData({ ...taskFormData, prioritas: e.target.value as CreateTaskDto['prioritas'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="LOW">Alacsony</option>
                  <option value="MEDIUM">Közepes</option>
                  <option value="HIGH">Magas</option>
                  <option value="URGENT">Sürgős</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Board <span className="text-red-500">*</span>
                </label>
                <select
                  value={taskFormData.boardId}
                  onChange={(e) => setTaskFormData({ ...taskFormData, boardId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Válasszon --</option>
                  {boards?.map((board: TaskBoard) => (
                    <option key={board.id} value={board.id}>
                      {board.nev}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hozzárendelve
                </label>
                <select
                  value={taskFormData.assignedToId}
                  onChange={(e) => setTaskFormData({ ...taskFormData, assignedToId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingUsers}
                >
                  <option value="">-- Senki --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nev} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Határidő
              </label>
              <input
                type="datetime-local"
                value={taskFormData.hataridoDatum}
                onChange={(e) => setTaskFormData({ ...taskFormData, hataridoDatum: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Címkék (vesszővel elválasztva)
              </label>
              <input
                type="text"
                value={taskFormData.tags}
                onChange={(e) => setTaskFormData({ ...taskFormData, tags: e.target.value })}
                placeholder="pl: fontos, urgent, bug"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseCreateTaskModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={createTask.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {createTask.isPending ? 'Létrehozás...' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreateBoardModalOpen}
        onClose={handleCloseCreateBoardModal}
        title="Új board"
        size="md"
      >
        <form onSubmit={handleSubmitBoard}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Név <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={boardFormData.nev}
                onChange={(e) => setBoardFormData({ ...boardFormData, nev: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leírás
              </label>
              <textarea
                value={boardFormData.leiras}
                onChange={(e) => setBoardFormData({ ...boardFormData, leiras: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Szín
              </label>
              <input
                type="color"
                value={boardFormData.szin}
                onChange={(e) => setBoardFormData({ ...boardFormData, szin: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseCreateBoardModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={createBoard.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {createBoard.isPending ? 'Létrehozás...' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
