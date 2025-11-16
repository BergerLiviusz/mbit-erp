import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from './create-task.dto';

export class TaskFilterDto {
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  allapot?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  prioritas?: TaskPriority;

  @IsOptional()
  @IsUUID()
  boardId?: string;

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

  @IsOptional()
  @IsString()
  search?: string;
}

