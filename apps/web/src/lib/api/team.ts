import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

// Types
export interface Task {
  id: string;
  cim: string;
  leiras?: string;
  allapot: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED' | 'CANCELLED';
  prioritas: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  hataridoDatum?: string;
  assignedToId?: string;
  createdById?: string;
  boardId?: string;
  position?: number;
  tags?: string;
  completedAt?: string;
  accountId?: string;
  opportunityId?: string;
  leadId?: string;
  quoteId?: string;
  orderId?: string;
  ticketId?: string;
  documentId?: string;
  assignedTo?: {
    id: string;
    nev: string;
    email: string;
  };
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  };
  board?: {
    id: string;
    nev: string;
  };
  _count?: {
    comments: number;
    attachments: number;
  };
}

export interface TaskBoard {
  id: string;
  nev: string;
  leiras?: string;
  szin?: string;
  aktiv: boolean;
  isDefault: boolean;
  createdById?: string;
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  };
  columns?: TaskColumn[];
  tasks?: Task[];
  members?: TaskBoardMember[];
  _count?: {
    tasks: number;
    members: number;
  };
}

export interface TaskColumn {
  id: string;
  boardId: string;
  nev: string;
  allapot: string;
  pozicio: number;
  limit?: number;
}

export interface TaskBoardMember {
  id: string;
  boardId: string;
  userId: string;
  jogosultsag: 'VIEW' | 'EDIT' | 'ADMIN';
  user?: {
    id: string;
    nev: string;
    email: string;
  };
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  szoveg: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    nev: string;
    email: string;
  };
}

export interface TaskActivity {
  id: string;
  taskId: string;
  userId?: string;
  tipus: string;
  leiras?: string;
  regiErtek?: string;
  ujErtek?: string;
  createdAt: string;
  user?: {
    id: string;
    nev: string;
    email: string;
  };
}

export interface CreateTaskDto {
  cim: string;
  leiras?: string;
  allapot: Task['allapot'];
  prioritas: Task['prioritas'];
  hataridoDatum?: string;
  assignedToId?: string;
  boardId?: string;
  tags?: string;
  accountId?: string;
  opportunityId?: string;
  leadId?: string;
  quoteId?: string;
  orderId?: string;
  ticketId?: string;
  documentId?: string;
}

export interface UpdateTaskDto {
  cim?: string;
  leiras?: string;
  allapot?: Task['allapot'];
  prioritas?: Task['prioritas'];
  hataridoDatum?: string;
  assignedToId?: string;
  boardId?: string;
  position?: number;
  tags?: string;
  accountId?: string;
  opportunityId?: string;
  leadId?: string;
  quoteId?: string;
  orderId?: string;
  ticketId?: string;
  documentId?: string;
}

export interface TaskFilter {
  assignedToId?: string;
  allapot?: Task['allapot'];
  prioritas?: Task['prioritas'];
  boardId?: string;
  accountId?: string;
  opportunityId?: string;
  leadId?: string;
  quoteId?: string;
  orderId?: string;
  ticketId?: string;
  documentId?: string;
  search?: string;
}

export interface MoveTaskDto {
  boardId: string;
  allapot: Task['allapot'];
  position: number;
}

export interface CreateBoardDto {
  nev: string;
  leiras?: string;
  szin?: string;
  isDefault?: boolean;
}

export interface CreateCommentDto {
  szoveg: string;
}

// Task hooks
export function useTasks(filters?: TaskFilter, skip = 0, take = 50) {
  return useQuery({
    queryKey: ['tasks', filters, skip, take],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      params.append('skip', String(skip));
      params.append('take', String(take));
      const response = await axios.get(`/api/team/tasks?${params.toString()}`);
      return response.data;
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await axios.get(`/api/team/tasks/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useMyTasks(skip = 0, take = 50) {
  return useQuery({
    queryKey: ['tasks', 'my', skip, take],
    queryFn: async () => {
      const response = await axios.get(`/api/team/tasks/my?skip=${skip}&take=${take}`);
      return response.data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTaskDto) => {
      const response = await axios.post('/api/team/tasks', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskDto }) => {
      const response = await axios.put(`/api/team/tasks/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/team/tasks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MoveTaskDto }) => {
      const response = await axios.patch(`/api/team/tasks/${id}/move`, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', id] });
      await queryClient.cancelQueries({ queryKey: ['boards'] });

      const previousTasks = queryClient.getQueryData(['tasks']);
      const previousTask = queryClient.getQueryData(['task', id]);
      const previousBoards = queryClient.getQueryData(['boards']);

      // Update task optimistically
      queryClient.setQueryData(['task', id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          boardId: data.boardId,
          allapot: data.allapot,
          position: data.position,
        };
      });

      return { previousTasks, previousTask, previousBoards };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      if (context?.previousTask) {
        queryClient.setQueryData(['task', variables.id], context.previousTask);
      }
      if (context?.previousBoards) {
        queryClient.setQueryData(['boards'], context.previousBoards);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

// Board hooks
export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const response = await axios.get('/api/team/boards');
      return response.data;
    },
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: ['board', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(`/api/team/boards/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBoardDto) => {
      const response = await axios.post('/api/team/boards', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateBoardDto> }) => {
      const response = await axios.put(`/api/team/boards/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['board', variables.id] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/team/boards/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

// Comment hooks
export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: ['task-comments', taskId],
    queryFn: async () => {
      const response = await axios.get(`/api/team/tasks/${taskId}/comments`);
      return response.data;
    },
    enabled: !!taskId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, data }: { taskId: string; data: CreateCommentDto }) => {
      const response = await axios.post(`/api/team/tasks/${taskId}/comments`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
    },
  });
}

// Dashboard hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/team/dashboard/stats');
      return response.data;
    },
  });
}

