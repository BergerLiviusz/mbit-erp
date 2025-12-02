import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

export interface WorkflowStep {
  id: string;
  workflowId: string;
  nev: string;
  leiras?: string | null;
  sorrend: number;
  szerepkorId?: string | null;
  szerepkor?: {
    id: string;
    nev: string;
  } | null;
  jogosultsag: string;
  kotelezo: boolean;
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
  szerepkorId?: string;
  jogosultsag?: string;
  kotelezo?: boolean;
}

export interface UpdateWorkflowDto {
  nev?: string;
  leiras?: string;
  aktiv?: boolean;
}

export interface UpdateWorkflowStepDto {
  nev?: string;
  leiras?: string;
  sorrend?: number;
  szerepkorId?: string;
  jogosultsag?: string;
  kotelezo?: boolean;
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

