import { Workflow } from '../../lib/api/workflow';

interface WorkflowDiagramProps {
  workflow: Workflow;
}

export default function WorkflowDiagram({ workflow }: WorkflowDiagramProps) {
  const sortedSteps = [...workflow.steps].sort((a, b) => a.sorrend - b.sorrend);


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{workflow.nev}</h3>
        {workflow.leiras && (
          <p className="text-sm text-gray-600 mt-1">{workflow.leiras}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            workflow.aktiv ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {workflow.aktiv ? 'Aktív' : 'Inaktív'}
          </span>
        </div>
      </div>

      <div className="relative">
        {/* Workflow steps */}
        <div className="flex flex-col gap-4">
          {sortedSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step card */}
              <div className={`relative bg-white border-2 rounded-lg p-4 shadow-sm ${
                step.kotelezo ? 'border-orange-400' : 'border-gray-300'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-semibold text-sm">
                        {step.sorrend}
                      </span>
                      <h4 className="text-md font-semibold text-gray-800">{step.nev}</h4>
                      {step.kotelezo && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded font-medium">
                          Kötelező
                        </span>
                      )}
                    </div>
                    {step.leiras && (
                      <p className="text-sm text-gray-600 ml-10 mb-2">{step.leiras}</p>
                    )}
                    <div className="flex flex-wrap gap-2 ml-10">
                      {step.lepesTipus && (
                        <span 
                          className="px-2 py-1 text-xs rounded border font-medium"
                          style={{
                            backgroundColor: step.szin ? `${step.szin}20` : '#3B82F620',
                            borderColor: step.szin || '#3B82F6',
                            color: step.szin || '#3B82F6',
                          }}
                        >
                          {step.lepesTipus}
                        </span>
                      )}
                      {step.assignedTo && (
                        <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800 font-medium">
                          👤 {step.assignedTo.nev}
                        </span>
                      )}
                      {step.Role && (
                        <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800 font-medium">
                          🎭 {step.Role.nev}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              {index < sortedSteps.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-0.5 h-8 bg-gray-400"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Start indicator */}
        <div className="absolute -left-8 top-0 bottom-0 flex flex-col items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
          <div className="w-0.5 h-full bg-green-500 mt-2"></div>
        </div>

        {/* End indicator */}
        <div className="absolute -right-8 bottom-0 flex items-center">
          <div className="w-0.5 h-full bg-green-500 mb-2"></div>
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
        </div>
      </div>

      {workflow.createdBy && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Létrehozta: <span className="font-medium">{workflow.createdBy.nev}</span>
            {' '}• {new Date(workflow.createdAt).toLocaleDateString('hu-HU')}
          </p>
        </div>
      )}
    </div>
  );
}

