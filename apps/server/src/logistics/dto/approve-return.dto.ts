import { IsOptional, IsString } from 'class-validator';

export class ApproveReturnDto {
  @IsOptional()
  @IsString()
  megjegyzesek?: string;
}

