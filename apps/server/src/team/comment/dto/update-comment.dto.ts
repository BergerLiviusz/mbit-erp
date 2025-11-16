import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  szoveg: string;
}

