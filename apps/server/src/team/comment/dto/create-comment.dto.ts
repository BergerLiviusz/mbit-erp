import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  szoveg: string;
}

