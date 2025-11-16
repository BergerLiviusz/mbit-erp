import { IsString, IsOptional, IsDateString, IsEnum, IsUUID } from 'class-validator';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
  CANCELLED = 'CANCELLED',
}

export class CreateTaskDto {
  @IsString()
  cim: string;

  @IsOptional()
  @IsString()
  leiras?: string;

  @IsEnum(TaskStatus)
  allapot: TaskStatus;

  @IsEnum(TaskPriority)
  prioritas: TaskPriority;

  @IsOptional()
  @IsDateString()
  hataridoDatum?: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @IsOptional()
  @IsUUID()
  boardId?: string;

  @IsOptional()
  tags?: string;

  // Kapcsolatok más modulokhoz
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @IsOptional()
  @IsUUID()
  opportunityId?: string;

  @IsOptional()
  @IsUUID()
  leadId?: string;

  @IsOptional()
  @IsUUID()
  quoteId?: string;

  @IsOptional()
  @IsUUID()
  orderId?: string;

  @IsOptional()
  @IsUUID()
  ticketId?: string;

  @IsOptional()
  @IsUUID()
  documentId?: string;
}

