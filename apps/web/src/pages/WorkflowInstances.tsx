import { useState, useEffect } from 'react';
import { useWorkflows } from '../lib/api/workflow';
import { 
  useWorkflowInstances, 
  useCreateWorkflowInstance, 
  useUpdateWorkflowStepLog,
  useCancelWorkflowInstance,
  useDelegateWorkflowStep,
  WorkflowInstance,
  CreateWorkflowInstanceDto 
} from '../lib/api/workflow';
import { apiFetch } from '../lib/api';
import Modal from '../components/Modal';
import { Plus, X, CheckCircle, Clock, Play } from 'lucide-react';

interface User {
  id: string;
  nev: string;
  email: string;
  aktiv?: boolean;
}

export default function WorkflowInstances() {
  const { data: workflows } = useWorkflows();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const { data: instances, isLoading } = useWorkflowInstances(selectedWorkflowId);
  const createInstance = useCreateWorkflowInstance();
  const updateStepLog = useUpdateWorkflowStepLog();
  const cancelInstance = useCancelWorkflowInstance();
  const delegateStep = useDelegateWorkflowStep();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<WorkflowInstance | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
  const [delegatingStep, setDelegatingStep] = useState<{ instanceId: string; stepId: string } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [delegateFormData, setDelegateFormData] = useState({ newAssignedToId: '', megjegyzes: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load users for delegation
  useEffect(() => {
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
    loadUsers();
  }, []);

  const [formData, setFormData] = useState<CreateWorkflowInstanceDto>({
    workflowId: '',
    nev: '',
  });

  const handleOpenCreateModal = () => {
    setFormData({
      workflowId: selectedWorkflowId || '',
      nev: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateInstance = async () => {
    if (!formData.workflowId) {
      setError('Válasszon workflow-t');
      return;
    }

    setError('');
    setSuccess('');

    try {
      await createInstance.mutateAsync(formData);
      setSuccess('Workflow példány sikeresen létrehozva');
      setIsCreateModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a workflow példány létrehozása során');
    }
  };

  const handleViewInstance = (instance: WorkflowInstance) => {
    setSelectedInstance(instance);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStepStatus = async (
    instanceId: string,
    stepLogId: string,
    newStatus: 'várakozik' | 'folyamatban' | 'befejezve' | 'kihagyva'
  ) => {
    try {
      await updateStepLog.mutateAsync({
        instanceId,
        stepLogId,
        data: { allapot: newStatus },
      });
      setSuccess('Lépés státusza sikeresen frissítve');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a státusz frissítése során');
    }
  };

  const handleCancelInstance = async (id: string) => {
    if (!confirm('Biztosan megszakítja ezt a workflow példányt?')) {
      return;
    }

    try {
      await cancelInstance.mutateAsync(id);
      setSuccess('Workflow példány sikeresen megszakítva');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a megszakítás során');
    }
  };

  const handleOpenDelegateModal = (instanceId: string, stepId: string) => {
    setDelegatingStep({ instanceId, stepId });
    setDelegateFormData({ newAssignedToId: '', megjegyzes: '' });
    setIsDelegateModalOpen(true);
  };

  const handleDelegateStep = async () => {
    if (!delegatingStep || !delegateFormData.newAssignedToId) {
      setError('Válasszon új felhasználót');
      return;
    }

    setError('');
    setSuccess('');

    try {
      await delegateStep.mutateAsync({
        instanceId: delegatingStep.instanceId,
        stepId: delegatingStep.stepId,
        data: {
          newAssignedToId: delegateFormData.newAssignedToId,
          megjegyzes: delegateFormData.megjegyzes || undefined,
        },
      });
      setSuccess('Feladat sikeresen delegálva');
      setIsDelegateModalOpen(false);
      setDelegatingStep(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a delegálás során');
    }
  };

  const getStatusBadge = (allapot: string) => {
    switch (allapot) {
      case 'aktív':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Aktív</span>;
      case 'befejezett':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Befejezett</span>;
      case 'megszakított':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Megszakított</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">{allapot}</span>;
    }
  };

  const getStepStatusIcon = (allapot: string) => {
    switch (allapot) {
      case 'befejezve':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'folyamatban':
        return <Play size={16} className="text-blue-600" />;
      case 'kihagyva':
        return <X size={16} className="text-gray-600" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Betöltés...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Workflow példányok</h1>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Új példány indítása
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Workflow szűrő */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workflow szűrő
        </label>
        <select
          value={selectedWorkflowId}
          onChange={(e) => setSelectedWorkflowId(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Összes workflow</option>
          {workflows?.map(w => (
            <option key={w.id} value={w.id}>{w.nev}</option>
          ))}
        </select>
      </div>

      {/* Instances list */}
      {!instances || instances.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Nincsenek workflow példányok</p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Első példány indítása
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {instances.map((instance) => (
            <div key={instance.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {instance.nev || instance.workflow.nev}
                    </h3>
                    {getStatusBadge(instance.allapot)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Workflow: <span className="font-medium">{instance.workflow.nev}</span>
                  </p>
                  {instance.createdBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      Létrehozta: {instance.createdBy.nev} • {new Date(instance.createdAt).toLocaleDateString('hu-HU')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewInstance(instance)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                  >
                    Részletek
                  </button>
                  {instance.allapot === 'aktív' && (
                    <button
                      onClick={() => handleCancelInstance(instance.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    >
                      Megszakítás
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Előrehaladás</span>
                  <span className="text-sm font-medium text-gray-800">
                    {instance.stepLogs.filter(sl => sl.allapot === 'befejezve').length} / {instance.stepLogs.length} lépés
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(instance.stepLogs.filter(sl => sl.allapot === 'befejezve').length / instance.stepLogs.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Current step */}
              {instance.aktualisLepes && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Jelenlegi lépés:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {instance.aktualisLepes.nev}
                    </span>
                    {instance.aktualisLepes.assignedTo && (
                      <span className="text-xs text-gray-500">
                        (Hozzárendelve: {instance.aktualisLepes.assignedTo.nev})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Instance Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Új workflow példány indítása"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workflow *
            </label>
            <select
              value={formData.workflowId}
              onChange={(e) => setFormData({ ...formData, workflowId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Válasszon --</option>
              {workflows?.filter(w => w.aktiv).map(w => (
                <option key={w.id} value={w.id}>{w.nev}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Példány neve (opcionális)
            </label>
            <input
              type="text"
              value={formData.nev}
              onChange={(e) => setFormData({ ...formData, nev: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Példány neve"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Mégse
            </button>
            <button
              onClick={handleCreateInstance}
              disabled={createInstance.isPending || !formData.workflowId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {createInstance.isPending ? 'Létrehozás...' : 'Indítás'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Instance Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedInstance(null);
        }}
        title={selectedInstance ? `Workflow példány: ${selectedInstance.nev || selectedInstance.workflow.nev}` : 'Részletek'}
        size="xl"
      >
        {selectedInstance && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Státusz</div>
                <div className="mt-1">{getStatusBadge(selectedInstance.allapot)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Előrehaladás</div>
                <div className="mt-1 text-sm font-medium">
                  {selectedInstance.stepLogs.filter(sl => sl.allapot === 'befejezve').length} / {selectedInstance.stepLogs.length} lépés
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Lépések állapota</h3>
              <div className="space-y-3">
                {selectedInstance.stepLogs.map((stepLog) => {
                  const isCurrent = selectedInstance.aktualisLepesId === stepLog.stepId;
                  const canUpdate = selectedInstance.allapot === 'aktív' && 
                    (stepLog.allapot === 'folyamatban' || stepLog.allapot === 'várakozik');

                  return (
                    <div
                      key={stepLog.id}
                      className={`border rounded-lg p-4 ${
                        isCurrent ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStepStatusIcon(stepLog.allapot)}
                            <span className="font-medium text-gray-800">
                              {stepLog.step.nev}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                                Jelenlegi lépés
                              </span>
                            )}
                          </div>
                          {stepLog.step.leiras && (
                            <p className="text-sm text-gray-600 mb-2">{stepLog.step.leiras}</p>
                          )}
                          {stepLog.step.assignedTo && (
                            <p className="text-xs text-gray-500">
                              Hozzárendelve: {stepLog.step.assignedTo.nev}
                            </p>
                          )}
                          {stepLog.completedBy && (
                            <p className="text-xs text-gray-500 mt-1">
                              Befejezte: {stepLog.completedBy.nev} • {new Date(stepLog.completedAt!).toLocaleDateString('hu-HU')}
                            </p>
                          )}
                          {stepLog.megjegyzes && (
                            <p className="text-sm text-gray-600 mt-2 italic">"{stepLog.megjegyzes}"</p>
                          )}
                        </div>
                        {canUpdate && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStepStatus(selectedInstance.id, stepLog.id, 'befejezve')}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                              title="Befejezés"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleUpdateStepStatus(selectedInstance.id, stepLog.id, 'kihagyva')}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                              title="Kihagyás"
                            >
                              <X size={16} />
                            </button>
                            {stepLog.step.assignedToId && (
                              <button
                                onClick={() => handleOpenDelegateModal(selectedInstance.id, stepLog.stepId)}
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                                title="Delegálás"
                              >
                                Delegálás
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delegate Modal */}
      <Modal
        isOpen={isDelegateModalOpen}
        onClose={() => {
          setIsDelegateModalOpen(false);
          setDelegatingStep(null);
        }}
        title="Feladat delegálása"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Új felelős felhasználó *
            </label>
            <select
              value={delegateFormData.newAssignedToId}
              onChange={(e) => setDelegateFormData({ ...delegateFormData, newAssignedToId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Válasszon --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.nev} ({u.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Megjegyzés (opcionális)
            </label>
            <textarea
              value={delegateFormData.megjegyzes}
              onChange={(e) => setDelegateFormData({ ...delegateFormData, megjegyzes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Delegálás oka vagy megjegyzés..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={() => {
                setIsDelegateModalOpen(false);
                setDelegatingStep(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Mégse
            </button>
            <button
              onClick={handleDelegateStep}
              disabled={delegateStep.isPending || !delegateFormData.newAssignedToId}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {delegateStep.isPending ? 'Delegálás...' : 'Delegálás'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

