import { useState } from 'react';
import { useWorkflows, useCreateWorkflow, useDeleteWorkflow, Workflow, CreateWorkflowDto } from '../lib/api/workflow';
import WorkflowDiagram from '../components/team/WorkflowDiagram';
import Modal from '../components/Modal';
import { Plus, Trash2, Eye } from 'lucide-react';

export default function Workflows() {
  const { data: workflows, isLoading } = useWorkflows();
  const createWorkflow = useCreateWorkflow();
  const deleteWorkflow = useDeleteWorkflow();
  
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<CreateWorkflowDto>({
    nev: '',
    leiras: '',
    aktiv: true,
    steps: [],
  });

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
        <h1 className="text-3xl font-bold text-gray-800">Folyamatleltár</h1>
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

      {!workflows || workflows.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Még nincsenek workflow-k</p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Első workflow létrehozása
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{workflow.nev}</h3>
                  {workflow.leiras && (
                    <p className="text-sm text-gray-600 mt-1">{workflow.leiras}</p>
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
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewWorkflow(workflow)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                >
                  <Eye size={16} />
                  Megtekintés
                </button>
                <button
                  onClick={() => handleDeleteWorkflow(workflow.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  title="Törlés"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
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

