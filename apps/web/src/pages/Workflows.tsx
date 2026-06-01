import { useState, useEffect } from 'react';
import { useWorkflows, useCreateWorkflow, useDeleteWorkflow, useUpdateWorkflow, Workflow, CreateWorkflowDto, UpdateWorkflowDto } from '../lib/api/workflow';
import WorkflowDiagram from '../components/team/WorkflowDiagram';
import Modal from '../components/Modal';
import { Plus, Trash2, Eye, Edit } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface User {
  id: string;
  nev: string;
  email: string;
  aktiv?: boolean;
}

interface Role {
  id: string;
  nev: string;
  leiras?: string | null;
}

type StepAssignFields = {
  assignedToId?: string | null;
  assignedUserIds?: string | null;
};

function getStepAssigneeIds(step: StepAssignFields): string[] {
  const ids: string[] = [];
  if (step.assignedToId) ids.push(step.assignedToId);
  if (step.assignedUserIds) {
    for (const part of step.assignedUserIds.split(',')) {
      const id = part.trim();
      if (id && !ids.includes(id)) ids.push(id);
    }
  }
  return ids;
}

function buildStepAssignmentPatch(selectedIds: string[]) {
  const unique = [...new Set(selectedIds.filter(Boolean))];
  return {
    assignedToId: unique[0] || undefined,
    assignedUserIds: unique.length > 1 ? unique.slice(1).join(',') : undefined,
  };
}

export default function Workflows() {
  const { data: workflows, isLoading } = useWorkflows();
  const createWorkflow = useCreateWorkflow();
  const updateWorkflow = useUpdateWorkflow();
  const deleteWorkflow = useDeleteWorkflow();
  
  // Get current user info from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?.id;
  const isAdmin = currentUser?.roles?.includes('Admin') || false;
  
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'my' | 'assigned'>('all');

  const [formData, setFormData] = useState<CreateWorkflowDto>({
    nev: '',
    leiras: '',
    aktiv: true,
    steps: [],
  });
  const [editFormData, setEditFormData] = useState<UpdateWorkflowDto & { id: string }>({
    id: '',
    nev: '',
    leiras: '',
    aktiv: true,
    steps: [],
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
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

  const loadRoles = async () => {
    try {
      const response = await apiFetch('/system/roles?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.items || data.data || []);
      }
    } catch (error) {
      console.error('Hiba a szerepkörök betöltésekor:', error);
    }
  };

  const handleOpenCreateModal = () => {
    setFormData({
      nev: '',
      leiras: '',
      aktiv: true,
      steps: [],
    });
    setIsCreateModalOpen(true);
  };

  const handleAddStep = () => {
    const newStepNumber = formData.steps.length + 1;
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        {
          nev: '',
          leiras: '',
          sorrend: newStepNumber,
          lepesTipus: '',
          szin: '#3B82F6',
          kotelezo: false,
        },
      ],
    });
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = formData.steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, sorrend: i + 1 }));
    setFormData({
      ...formData,
      steps: newSteps,
    });
  };

  const handleStepChange = (index: number, field: string, value: any) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, steps: newSteps });
  };

  const handleCreateWorkflow = async () => {
    if (!formData.nev || formData.steps.length < 5) {
      setError('A workflow név kötelező és legalább 5 lépés szükséges');
      return;
    }

    if (formData.steps.some(step => !step.nev)) {
      setError('Minden lépésnek kell neve');
      return;
    }

    setError('');
    setSuccess('');

    try {
      await createWorkflow.mutateAsync(formData);
      setSuccess('Workflow sikeresen létrehozva');
      setIsCreateModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a workflow létrehozása során');
    }
  };

  const handleViewWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsViewModalOpen(true);
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setEditFormData({
      id: workflow.id,
      nev: workflow.nev,
      leiras: workflow.leiras || '',
      aktiv: workflow.aktiv,
      steps: workflow.steps.map(step => ({
        id: step.id,
        nev: step.nev,
        leiras: step.leiras || '',
        sorrend: step.sorrend,
        lepesTipus: step.lepesTipus || '',
        szin: step.szin || '#3B82F6',
        kotelezo: step.kotelezo,
        assignedToId: step.assignedToId || undefined,
        assignedUserIds: step.assignedUserIds || undefined,
        roleId: step.roleId || undefined,
      })),
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateWorkflow = async () => {
    if (!editFormData.nev || !editFormData.steps || editFormData.steps.length < 5) {
      setError('A workflow név kötelező és legalább 5 lépés szükséges');
      return;
    }

    if (editFormData.steps.some(step => !step.nev)) {
      setError('Minden lépésnek kell neve');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const { id, ...updateData } = editFormData;
      await updateWorkflow.mutateAsync({ id, data: updateData });
      setSuccess('Workflow sikeresen frissítve');
      setIsEditModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a workflow frissítése során');
    }
  };

  const handleAddEditStep = () => {
    const newStepNumber = (editFormData.steps?.length || 0) + 1;
    setEditFormData({
      ...editFormData,
      steps: [
        ...(editFormData.steps || []),
        {
          nev: '',
          leiras: '',
          sorrend: newStepNumber,
          lepesTipus: '',
          szin: '#3B82F6',
          kotelezo: false,
        },
      ],
    });
  };

  const handleRemoveEditStep = (index: number) => {
    const newSteps = (editFormData.steps || [])
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, sorrend: i + 1 }));
    setEditFormData({
      ...editFormData,
      steps: newSteps,
    });
  };

  const handleEditStepChange = (index: number, field: string, value: any) => {
    const newSteps = [...(editFormData.steps || [])];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setEditFormData({ ...editFormData, steps: newSteps });
  };

  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm('Biztosan törölni szeretné ezt a workflow-t?')) {
      return;
    }

    try {
      await deleteWorkflow.mutateAsync(id);
      setSuccess('Workflow sikeresen törölve');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a workflow törlése során');
    }
  };

  // Filter workflows based on view mode and permissions
  const filteredWorkflows = workflows?.filter(workflow => {
    if (isAdmin) {
      // Admin sees all workflows
      if (viewMode === 'all') return true;
      if (viewMode === 'my') return workflow.createdById === currentUserId;
      if (viewMode === 'assigned') {
        return workflow.steps.some(step => step.assignedToId === currentUserId);
      }
      return true;
    } else {
      // Non-admin users only see workflows they created or are assigned to
      if (viewMode === 'all') {
        return workflow.createdById === currentUserId || 
               workflow.steps.some(step => step.assignedToId === currentUserId);
      }
      if (viewMode === 'my') return workflow.createdById === currentUserId;
      if (viewMode === 'assigned') {
        return workflow.steps.some(step => step.assignedToId === currentUserId);
      }
      return false;
    }
  }) || [];

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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Folyamatleltár</h1>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Nézet:</span>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'all' | 'my' | 'assigned')}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">{isAdmin ? 'Összes' : 'Látható'}</option>
                <option value="my">Saját workflow-k</option>
                <option value="assigned">Hozzárendelt feladatok</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {isAdmin ? (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                  👑 Admin nézet
                </span>
              ) : (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  👤 Felhasználó nézet
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Új Workflow
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

      {!filteredWorkflows || filteredWorkflows.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">
            {viewMode === 'all' 
              ? (isAdmin ? 'Még nincsenek workflow-k' : 'Nincs látható workflow')
              : viewMode === 'my'
              ? 'Nincsenek saját workflow-k'
              : 'Nincsenek hozzárendelt feladatok'}
          </p>
          {viewMode === 'all' && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Első workflow létrehozása
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => {
            const canEdit = isAdmin || workflow.createdById === currentUserId;
            const isAssigned = workflow.steps.some(step => step.assignedToId === currentUserId);
            
            return (
            <div key={workflow.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">{workflow.nev}</h3>
                    {workflow.createdById === currentUserId && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded font-medium">
                        Saját
                      </span>
                    )}
                    {isAssigned && workflow.createdById !== currentUserId && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                        Hozzárendelt
                      </span>
                    )}
                  </div>
                  {workflow.leiras && (
                    <p className="text-sm text-gray-600 mt-1">{workflow.leiras}</p>
                  )}
                  {workflow.createdBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      Létrehozta: {workflow.createdBy.nev}
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  workflow.aktiv ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {workflow.aktiv ? 'Aktív' : 'Inaktív'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{workflow.steps.length}</span> lépés
                </p>
                {workflow.steps.filter(s => s.assignedToId === currentUserId).length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {workflow.steps.filter(s => s.assignedToId === currentUserId).length} hozzárendelt lépés
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewWorkflow(workflow)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                >
                  <Eye size={16} />
                  Megtekintés
                </button>
                {canEdit && (
                  <>
                    <button
                      onClick={() => handleEditWorkflow(workflow)}
                      className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      title="Szerkesztés"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      title="Törlés"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                {!canEdit && (
                  <div className="px-3 py-2 text-xs text-gray-500" title="Nincs szerkesztési jogosultság">
                    Csak megtekintés
                  </div>
                )}
              </div>
            </div>
          );
          })}
        </div>
      )}

      {/* Create Workflow Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Új Workflow létrehozása"
        size="xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Név *
            </label>
            <input
              type="text"
              value={formData.nev}
              onChange={(e) => setFormData({ ...formData, nev: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Workflow neve"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leírás
            </label>
            <textarea
              value={formData.leiras}
              onChange={(e) => setFormData({ ...formData, leiras: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Workflow leírása"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.aktiv}
                onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">Aktív</span>
            </label>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Lépések (minimum 5)</h3>
              <button
                onClick={handleAddStep}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
              >
                + Lépés hozzáadása
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {formData.steps.map((step, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Lépés {step.sorrend}</span>
                    {formData.steps.length > 5 && (
                      <button
                        onClick={() => handleRemoveStep(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Törlés
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={step.nev}
                      onChange={(e) => handleStepChange(index, 'nev', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Lépés neve *"
                    />
                    <textarea
                      value={step.leiras || ''}
                      onChange={(e) => handleStepChange(index, 'leiras', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      rows={2}
                      placeholder="Lépés leírása"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Lépés típusa</label>
                        <input
                          type="text"
                          value={step.lepesTipus || ''}
                          onChange={(e) => handleStepChange(index, 'lepesTipus', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Pl. Ellenőrzés, Jóváhagyás, Archiválás..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Szín</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={step.szin || '#3B82F6'}
                            onChange={(e) => handleStepChange(index, 'szin', e.target.value)}
                            className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                            title="Szín választása"
                          />
                          <input
                            type="text"
                            value={step.szin || '#3B82F6'}
                            onChange={(e) => handleStepChange(index, 'szin', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="#3B82F6"
                            pattern="^#[0-9A-Fa-f]{6}$"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Hozzárendelt személyek</label>
                        <select
                          multiple
                          value={getStepAssigneeIds(step)}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                            const patch = buildStepAssignmentPatch(selected);
                            const newSteps = [...formData.steps];
                            newSteps[index] = { ...newSteps[index], ...patch };
                            setFormData({ ...formData, steps: newSteps });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[88px]"
                        >
                          {users.map(u => (
                            <option key={u.id} value={u.id}>{u.nev} ({u.email})</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Ctrl/Cmd + kattintás: több személy</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Szerepkör</label>
                        <select
                          value={step.roleId || ''}
                          onChange={(e) => handleStepChange(index, 'roleId', e.target.value || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="">-- Válasszon --</option>
                          {roles.map(r => (
                            <option key={r.id} value={r.id}>{r.nev}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={step.kotelezo}
                        onChange={(e) => handleStepChange(index, 'kotelezo', e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">Kötelező lépés</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Mégse
            </button>
            <button
              onClick={handleCreateWorkflow}
              disabled={createWorkflow.isPending || formData.steps.length < 5}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {createWorkflow.isPending ? 'Létrehozás...' : 'Létrehozás'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Workflow Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Workflow szerkesztése"
        size="xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Név *
            </label>
            <input
              type="text"
              value={editFormData.nev}
              onChange={(e) => setEditFormData({ ...editFormData, nev: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Workflow neve"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leírás
            </label>
            <textarea
              value={editFormData.leiras}
              onChange={(e) => setEditFormData({ ...editFormData, leiras: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Workflow leírása"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editFormData.aktiv}
                onChange={(e) => setEditFormData({ ...editFormData, aktiv: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">Aktív</span>
            </label>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Lépések (minimum 5)</h3>
              <button
                onClick={handleAddEditStep}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
              >
                + Lépés hozzáadása
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {(editFormData.steps || []).map((step, index) => (
                <div key={step.id || index} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Lépés {step.sorrend}</span>
                    {(editFormData.steps?.length || 0) > 5 && (
                      <button
                        onClick={() => handleRemoveEditStep(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Törlés
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={step.nev || ''}
                      onChange={(e) => handleEditStepChange(index, 'nev', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Lépés neve *"
                    />
                    <textarea
                      value={step.leiras || ''}
                      onChange={(e) => handleEditStepChange(index, 'leiras', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      rows={2}
                      placeholder="Lépés leírása"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Lépés típusa</label>
                        <input
                          type="text"
                          value={step.lepesTipus || ''}
                          onChange={(e) => handleEditStepChange(index, 'lepesTipus', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Pl. Ellenőrzés, Jóváhagyás, Archiválás..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Szín</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={step.szin || '#3B82F6'}
                            onChange={(e) => handleEditStepChange(index, 'szin', e.target.value)}
                            className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                            title="Szín választása"
                          />
                          <input
                            type="text"
                            value={step.szin || '#3B82F6'}
                            onChange={(e) => handleEditStepChange(index, 'szin', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="#3B82F6"
                            pattern="^#[0-9A-Fa-f]{6}$"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Hozzárendelt személyek</label>
                        <select
                          multiple
                          value={getStepAssigneeIds(step)}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                            const patch = buildStepAssignmentPatch(selected);
                            const newSteps = [...(editFormData.steps || [])];
                            newSteps[index] = { ...newSteps[index], ...patch };
                            setEditFormData({ ...editFormData, steps: newSteps });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[88px]"
                        >
                          {users.map(u => (
                            <option key={u.id} value={u.id}>{u.nev} ({u.email})</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Ctrl/Cmd + kattintás: több személy</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Szerepkör</label>
                        <select
                          value={step.roleId || ''}
                          onChange={(e) => handleEditStepChange(index, 'roleId', e.target.value || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="">-- Válasszon --</option>
                          {roles.map(r => (
                            <option key={r.id} value={r.id}>{r.nev}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={step.kotelezo || false}
                        onChange={(e) => handleEditStepChange(index, 'kotelezo', e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">Kötelező lépés</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Mégse
            </button>
            <button
              onClick={handleUpdateWorkflow}
              disabled={updateWorkflow.isPending || !editFormData.steps || editFormData.steps.length < 5}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {updateWorkflow.isPending ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Workflow Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedWorkflow?.nev || 'Workflow részletek'}
        size="xl"
      >
        {selectedWorkflow && (
          <WorkflowDiagram workflow={selectedWorkflow} />
        )}
      </Modal>
    </div>
  );
}

