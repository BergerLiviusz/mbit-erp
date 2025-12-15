import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';

@Controller('system/roles')
@UseGuards(RbacGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @Permissions(Permission.USER_VIEW)
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.roleService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
    );
  }

  @Get(':id')
  @Permissions(Permission.USER_VIEW)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }
}

