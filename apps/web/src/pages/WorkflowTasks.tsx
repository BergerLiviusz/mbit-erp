import { useState, useEffect } from 'react';
import { useWorkflows } from '../lib/api/workflow';
import { apiFetch } from '../lib/api';
import Modal from '../components/Modal';

interface User {
  id: string;
  nev: string;
  email: string;
  aktiv?: boolean;
}

interface WorkflowStep {
  id: string;
  nev: string;
  leiras?: string | null;
  sorrend: number;
  lepesTipus?: string | null;
  kotelezo?: boolean;
  assignedToId?: string | null;
  roleId?: string | null;
  assignedTo?: User | null;
  Role?: {
    id: string;
    nev: string;
  } | null;
}

interface Workflow {
  id: string;
  nev: string;
  steps: WorkflowStep[];
}

export default function WorkflowTasks() {
  const { data: workflows, isLoading } = useWorkflows();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const [selectedStep, setSelectedStep] = useState<{ workflow: Workflow; step: WorkflowStep } | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiFetch('/system/users?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setUsers((data.items || data.data || []).filter((u: User) => u.aktiv));
      }
    } catch (error) {
      console.error('Hiba a felhasználók betöltésekor:', error);
    }
  };

  // Get tasks for selected user
  const getUserTasks = () => {
    if (!workflows || !selectedUserId) return [];

    const tasks: Array<{ workflow: Workflow; step: WorkflowStep }> = [];

    workflows.forEach(workflow => {
      workflow.steps.forEach(step => {
        if (step.assignedToId === selectedUserId) {
          tasks.push({ workflow, step });
        }
      });
    });

    return tasks.sort((a, b) => a.step.sorrend - b.step.sorrend);
  };

  // Get tasks for selected workflow
  const getWorkflowTasks = () => {
    if (!workflows || !selectedWorkflowId) return [];

    const workflow = workflows.find(w => w.id === selectedWorkflowId);
    if (!workflow) return [];

    return workflow.steps
      .filter(step => step.assignedToId)
      .map(step => ({
        workflow,
        step,
      }))
      .sort((a, b) => a.step.sorrend - b.step.sorrend);
  };

  const userTasks = getUserTasks();
  const workflowTasks = getWorkflowTasks();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Betöltés...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Feladatlista</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Felhasználó szerinti szűrés */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Felhasználó szerinti feladatok</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Válasszon felhasználót
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Válasszon --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.nev} ({u.email})</option>
              ))}
            </select>
          </div>

          {selectedUserId && (
            <div className="space-y-2">
              {userTasks.length === 0 ? (
                <p className="text-gray-500 text-sm">Nincsenek hozzárendelt feladatok</p>
              ) : (
                userTasks.map(({ workflow, step }) => (
                  <div
                    key={`${workflow.id}-${step.id}`}
                    className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedStep({ workflow, step });
                      setIsDetailModalOpen(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{workflow.nev}</div>
                        <div className="text-sm text-gray-600 mt-1">{step.nev}</div>
                        {step.leiras && (
                          <div className="text-xs text-gray-500 mt-1">{step.leiras}</div>
                        )}
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                        Lépés {step.sorrend}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Workflow szerinti szűrés */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Workflow szerinti feladatok</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Válasszon workflow-t
            </label>
            <select
              value={selectedWorkflowId}
              onChange={(e) => setSelectedWorkflowId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Válasszon --</option>
              {workflows?.map(w => (
                <option key={w.id} value={w.id}>{w.nev}</option>
              ))}
            </select>
          </div>

          {selectedWorkflowId && (
            <div className="space-y-2">
              {workflowTasks.length === 0 ? (
                <p className="text-gray-500 text-sm">Nincsenek hozzárendelt feladatok</p>
              ) : (
                workflowTasks.map(({ workflow, step }) => (
                  <div
                    key={`${workflow.id}-${step.id}`}
                    className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedStep({ workflow, step });
                      setIsDetailModalOpen(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{step.nev}</div>
                        {step.leiras && (
                          <div className="text-sm text-gray-600 mt-1">{step.leiras}</div>
                        )}
                        {step.assignedTo && (
                          <div className="text-xs text-gray-500 mt-1">
                            👤 {step.assignedTo.nev} ({step.assignedTo.email})
                          </div>
                        )}
                        {step.Role && (
                          <div className="text-xs text-gray-500 mt-1">
                            🎭 {step.Role.nev}
                          </div>
                        )}
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                        Lépés {step.sorrend}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Összesítő táblázat */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Összesítő: Felhasználók és hozzárendelt feladatok</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Felhasználó</th>
                <th className="text-left p-4 font-medium text-gray-700">Workflow</th>
                <th className="text-left p-4 font-medium text-gray-700">Lépés</th>
                <th className="text-left p-4 font-medium text-gray-700">Lépés típusa</th>
                <th className="text-left p-4 font-medium text-gray-700">Szerepkör</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => {
                const userWorkflowSteps = workflows?.flatMap(workflow =>
                  workflow.steps
                    .filter(step => step.assignedToId === user.id)
                    .map(step => ({ workflow, step }))
                ) || [];

                if (userWorkflowSteps.length === 0) return null;

                return userWorkflowSteps.map(({ workflow, step }, idx) => (
                  <tr key={`${user.id}-${workflow.id}-${step.id}`} className="hover:bg-gray-50">
                    {idx === 0 && (
                      <td className="p-4" rowSpan={userWorkflowSteps.length}>
                        <div className="font-medium">{user.nev}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                    )}
                    <td className="p-4">{workflow.nev}</td>
                    <td className="p-4">
                      <div className="font-medium">{step.nev}</div>
                      <div className="text-xs text-gray-500">Lépés {step.sorrend}</div>
                    </td>
                    <td className="p-4">
                      {step.lepesTipus ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {step.lepesTipus}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {step.Role ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          {step.Role.nev}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Részletek modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStep(null);
        }}
        title={selectedStep ? `Feladat részletei: ${selectedStep.step.nev}` : 'Részletek'}
        size="lg"
      >
        {selectedStep && (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Workflow</div>
              <div className="font-medium">{selectedStep.workflow.nev}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Lépés neve</div>
              <div className="font-medium">{selectedStep.step.nev}</div>
            </div>
            {selectedStep.step.leiras && (
              <div>
                <div className="text-sm text-gray-600">Leírás</div>
                <div>{selectedStep.step.leiras}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600">Sorrend</div>
              <div>Lépés {selectedStep.step.sorrend}</div>
            </div>
            {selectedStep.step.lepesTipus && (
              <div>
                <div className="text-sm text-gray-600">Lépés típusa</div>
                <div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedStep.step.lepesTipus}
                  </span>
                </div>
              </div>
            )}
            {selectedStep.step.assignedTo && (
              <div>
                <div className="text-sm text-gray-600">Hozzárendelt személy</div>
                <div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    👤 {selectedStep.step.assignedTo.nev} ({selectedStep.step.assignedTo.email})
                  </span>
                </div>
              </div>
            )}
            {selectedStep.step.Role && (
              <div>
                <div className="text-sm text-gray-600">Szerepkör</div>
                <div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                    🎭 {selectedStep.step.Role.nev}
                  </span>
                </div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600">Kötelező lépés</div>
              <div>
                {selectedStep.step.kotelezo ? (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    Igen
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">Nem</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

