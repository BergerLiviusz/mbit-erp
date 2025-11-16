import { IsUUID, IsInt, IsEnum } from 'class-validator';
import { TaskStatus } from './create-task.dto';

export class MoveTaskDto {
  @IsUUID()
  boardId: string;

  @IsEnum(TaskStatus)
  allapot: TaskStatus;

  @IsInt()
  position: number;
}

