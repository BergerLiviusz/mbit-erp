import { IsUUID, IsEnum } from 'class-validator';

export enum BoardMemberPermission {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  ADMIN = 'ADMIN',
}

export class AddMemberDto {
  @IsUUID()
  userId: string;

  @IsEnum(BoardMemberPermission)
  jogosultsag: BoardMemberPermission;
}

