import { IsString, IsOptional, IsDateString, IsEnum, IsUUID, IsInt } from 'class-validator';
import { TaskPriority, TaskStatus } from './create-task.dto';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  cim?: string;

  @IsOptional()
  @IsString()
  leiras?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  allapot?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  prioritas?: TaskPriority;

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
  @IsInt()
  position?: number;

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

