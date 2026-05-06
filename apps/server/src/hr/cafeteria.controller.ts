import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CafeteriaService } from './cafeteria.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('hr/cafeteria')
@UseGuards(RbacGuard)
export class CafeteriaController {
  constructor(private svc: CafeteriaService) {}

  @Get('groups')
  @Permissions(Permission.HR_VIEW)
  listGroups(@Query('aktiv') aktiv?: string) {
    return this.svc.listGroups(aktiv === undefined ? undefined : aktiv === 'true');
  }

  @Post('groups')
  @Permissions(Permission.HR_CREATE)
  createGroup(@Body() body: any) {
    return this.svc.createGroup(body);
  }

  @Put('groups/:id')
  @Permissions(Permission.HR_EDIT)
  updateGroup(@Param('id') id: string, @Body() body: any) {
    return this.svc.updateGroup(id, body);
  }

  @Delete('groups/:id')
  @Permissions(Permission.HR_DELETE)
  deleteGroup(@Param('id') id: string) {
    return this.svc.deleteGroup(id);
  }

  @Post('groups/:groupId/items')
  @Permissions(Permission.HR_CREATE)
  createItem(@Param('groupId') groupId: string, @Body() body: any) {
    return this.svc.createItem(groupId, body);
  }

  @Put('items/:id')
  @Permissions(Permission.HR_EDIT)
  updateItem(@Param('id') id: string, @Body() body: any) {
    return this.svc.updateItem(id, body);
  }

  @Delete('items/:id')
  @Permissions(Permission.HR_DELETE)
  deleteItem(@Param('id') id: string) {
    return this.svc.deleteItem(id);
  }

  @Get('employees/:employeeId/selections')
  @Permissions(Permission.HR_VIEW)
  listSelections(@Param('employeeId') employeeId: string, @Query('ev') ev?: string) {
    return this.svc.listSelections(employeeId, ev ? parseInt(ev, 10) : undefined);
  }

  @Post('selections')
  @Permissions(Permission.HR_EDIT)
  upsertSelection(@Body() body: any) {
    return this.svc.upsertSelection(body);
  }
}
