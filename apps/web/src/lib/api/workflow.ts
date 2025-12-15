import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

export interface WorkflowStep {
  id: string;
  workflowId: string;
  nev: string;
  leiras?: string | null;
  sorrend: number;
  lepesTipus?: string | null;
  szin?: string | null;
  kotelezo: boolean;
  assignedToId?: string | null;
  roleId?: string | null;
  assignedTo?: {
    id: string;
    nev: string;
    email: string;
  } | null;
  Role?: {
    id: string;
    nev: string;
    leiras?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Workflow {
  id: string;
  nev: string;
  leiras?: string | null;
  aktiv: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string | null;
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  } | null;
  steps: WorkflowStep[];
}

export interface CreateWorkflowDto {
  nev: string;
  leiras?: string;
  aktiv?: boolean;
  steps: CreateWorkflowStepDto[];
}

export interface CreateWorkflowStepDto {
  nev: string;
  leiras?: string;
  sorrend: number;
  lepesTipus?: string;
  szin?: string;
  kotelezo?: boolean;
  assignedToId?: string;
  roleId?: string;
}

export interface UpdateWorkflowDto {
  nev?: string;
  leiras?: string;
  aktiv?: boolean;
  steps?: Array<{
    id?: string;
    nev?: string;
    leiras?: string;
    sorrend?: number;
    lepesTipus?: string;
    szin?: string;
    kotelezo?: boolean;
    assignedToId?: string;
    roleId?: string;
  }>;
}

export interface UpdateWorkflowStepDto {
  nev?: string;
  leiras?: string;
  sorrend?: number;
  lepesTipus?: string;
  szin?: string;
  kotelezo?: boolean;
  assignedToId?: string;
  roleId?: string;
}

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const response = await axios.get('/api/team/workflows');
      return response.data as Workflow[];
    },
  });
}

export function useWorkflow(id: string) {
  return useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      const response = await axios.get(`/api/team/workflows/${id}`);
      return response.data as Workflow;
    },
    enabled: !!id,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWorkflowDto) => {
      const response = await axios.post('/api/team/workflows', data);
      return response.data as Workflow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateWorkflowDto }) => {
      const response = await axios.put(`/api/team/workflows/${id}`, data);
      return response.data as Workflow;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', variables.id] });
    },
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/team/workflows/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

export function useAddWorkflowStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workflowId, data }: { workflowId: string; data: CreateWorkflowStepDto }) => {
      const response = await axios.post(`/api/team/workflows/${workflowId}/steps`, data);
      return response.data as WorkflowStep;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', variables.workflowId] });
    },
  });
}

export function useUpdateWorkflowStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workflowId, stepId, data }: { workflowId: string; stepId: string; data: UpdateWorkflowStepDto }) => {
      const response = await axios.put(`/api/team/workflows/${workflowId}/steps/${stepId}`, data);
      return response.data as WorkflowStep;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', variables.workflowId] });
    },
  });
}

export function useDeleteWorkflowStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workflowId, stepId }: { workflowId: string; stepId: string }) => {
      const response = await axios.delete(`/api/team/workflows/${workflowId}/steps/${stepId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', variables.workflowId] });
    },
  });
}

// Workflow Instance interfaces and hooks
export interface WorkflowStepLog {
  id: string;
  instanceId: string;
  stepId: string;
  allapot: 'várakozik' | 'folyamatban' | 'befejezve' | 'kihagyva';
  megjegyzes?: string | null;
  completedById?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  step: WorkflowStep;
  completedBy?: {
    id: string;
    nev: string;
    email: string;
  } | null;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  nev?: string | null;
  allapot: 'aktív' | 'befejezett' | 'megszakított';
  aktualisLepesId?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  createdById?: string | null;
  workflow: {
    id: string;
    nev: string;
    leiras?: string | null;
    steps: WorkflowStep[];
  };
  aktualisLepes?: WorkflowStep | null;
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  } | null;
  stepLogs: WorkflowStepLog[];
}

export interface CreateWorkflowInstanceDto {
  workflowId: string;
  nev?: string;
}

export interface UpdateWorkflowStepLogDto {
  allapot: 'várakozik' | 'folyamatban' | 'befejezve' | 'kihagyva';
  megjegyzes?: string;
}

export function useWorkflowInstances(workflowId?: string) {
  return useQuery({
    queryKey: ['workflow-instances', workflowId],
    queryFn: async () => {
      const url = workflowId 
        ? `/api/team/workflow-instances?workflowId=${workflowId}`
        : '/api/team/workflow-instances';
      const response = await axios.get(url);
      return response.data as WorkflowInstance[];
    },
  });
}

export function useWorkflowInstance(id: string) {
  return useQuery({
    queryKey: ['workflow-instance', id],
    queryFn: async () => {
      const response = await axios.get(`/api/team/workflow-instances/${id}`);
      return response.data as WorkflowInstance;
    },
    enabled: !!id,
  });
}

export function useCreateWorkflowInstance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWorkflowInstanceDto) => {
      const response = await axios.post('/api/team/workflow-instances', data);
      return response.data as WorkflowInstance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-instances'] });
    },
  });
}

export function useUpdateWorkflowStepLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      instanceId, 
      stepLogId, 
      data 
    }: { 
      instanceId: string; 
      stepLogId: string; 
      data: UpdateWorkflowStepLogDto 
    }) => {
      const response = await axios.put(
        `/api/team/workflow-instances/${instanceId}/step-logs/${stepLogId}`,
        data
      );
      return response.data as WorkflowStepLog;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflow-instances'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-instance', variables.instanceId] });
    },
  });
}

export function useCancelWorkflowInstance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.put(`/api/team/workflow-instances/${id}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-instances'] });
    },
  });
}

export interface DelegateWorkflowStepDto {
  newAssignedToId: string;
  megjegyzes?: string;
}

export function useDelegateWorkflowStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      instanceId, 
      stepId, 
      data 
    }: { 
      instanceId: string; 
      stepId: string; 
      data: DelegateWorkflowStepDto 
    }) => {
      const response = await axios.put(
        `/api/team/workflow-instances/${instanceId}/steps/${stepId}/delegate`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflow-instances'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-instance', variables.instanceId] });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

