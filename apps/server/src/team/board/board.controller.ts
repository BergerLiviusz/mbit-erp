import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { Permissions } from '../../common/rbac/rbac.decorator';
import { Permission } from '../../common/rbac/permission.enum';
import { RbacGuard } from '../../common/rbac/rbac.guard';

@Controller('team/boards')
@UseGuards(RbacGuard)
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  @Permissions(Permission.BOARD_VIEW)
  async findAll(@Request() req: any) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.boardService.findUserBoards(userId, isAdmin);
  }

  @Get(':id')
  @Permissions(Permission.BOARD_VIEW)
  async findOne(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.boardService.findOne(id, userId, isAdmin);
  }

  @Post()
  @Permissions(Permission.BOARD_CREATE)
  async create(@Request() req: any, @Body() dto: CreateBoardDto) {
    return await this.boardService.create(dto, req.user?.id || null);
  }

  @Put(':id')
  @Permissions(Permission.BOARD_EDIT)
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateBoardDto,
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.boardService.update(id, dto, userId, isAdmin);
  }

  @Delete(':id')
  @Permissions(Permission.BOARD_DELETE)
  async delete(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.boardService.delete(id, userId, isAdmin);
  }

  @Post(':id/members')
  @Permissions(Permission.BOARD_MANAGE_MEMBERS)
  async addMember(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AddMemberDto,
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.boardService.addMember(id, dto, userId, isAdmin);
  }

  @Delete(':id/members/:userId')
  @Permissions(Permission.BOARD_MANAGE_MEMBERS)
  async removeMember(
    @Request() req: any,
    @Param('id') id: string,
    @Param('userId') memberUserId: string,
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.boardService.removeMember(id, memberUserId, userId, isAdmin);
  }

  @Get(':id/columns')
  @Permissions(Permission.BOARD_VIEW)
  async getColumns(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.boardService.getColumns(id, userId, isAdmin);
  }

  @Post(':id/columns')
  @Permissions(Permission.BOARD_EDIT)
  async createColumn(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: { nev: string; allapot: string; pozicio: number; limit?: number },
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.boardService.createColumn(id, data, userId, isAdmin);
  }

  @Put(':id/columns/:columnId')
  @Permissions(Permission.BOARD_EDIT)
  async updateColumn(
    @Request() req: any,
    @Param('id') id: string,
    @Param('columnId') columnId: string,
    @Body() data: { nev?: string; pozicio?: number; limit?: number },
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.boardService.updateColumn(id, columnId, data, userId, isAdmin);
  }

  @Delete(':id/columns/:columnId')
  @Permissions(Permission.BOARD_EDIT)
  async deleteColumn(
    @Request() req: any,
    @Param('id') id: string,
    @Param('columnId') columnId: string,
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.roles?.includes('Admin') || false;

    return await this.boardService.deleteColumn(id, columnId, userId, isAdmin);
  }
}

