import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UserService, CreateUserDto, UpdateUserDto, ChangePasswordDto } from './user.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('system/users')
@UseGuards(RbacGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.USER_VIEW)
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.userService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
    );
  }

  @Get(':id')
  @Permissions(Permission.USER_VIEW)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @Permissions(Permission.USER_CREATE)
  async create(@Body() dto: CreateUserDto, @Request() req: any) {
    const user = await this.userService.create(dto);
    await this.auditService.logCreate('User', user.id, user, req.user?.id);
    return user;
  }

  @Put(':id')
  @Permissions(Permission.USER_EDIT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: any,
  ) {
    const old = await this.userService.findOne(id);
    const updated = await this.userService.update(id, dto);
    await this.auditService.logUpdate('User', id, old, updated, req.user?.id);
    return updated;
  }

  @Put(':id/password')
  @Permissions(Permission.USER_EDIT)
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
    @Request() req: any,
  ) {
    // Users can only change their own password unless they're admin
    const currentUser = req.user;
    const isAdmin = currentUser?.roles?.includes('Admin');
    
    if (!isAdmin && currentUser?.id !== id) {
      throw new BadRequestException('Csak a saját jelszavadat módosíthatod');
    }

    await this.userService.changePassword(id, dto);
    await this.auditService.logUpdate('User', id, { password: '***' }, { password: '***' }, req.user?.id);
    return { message: 'Jelszó sikeresen módosítva' };
  }

  @Put(':id/admin-password')
  @Permissions(Permission.USER_EDIT)
  async adminChangePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
    @Request() req: any,
  ) {
    // Only admins can use this endpoint
    const currentUser = req.user;
    const isAdmin = currentUser?.roles?.includes('Admin');
    
    if (!isAdmin) {
      throw new BadRequestException('Csak adminisztrátorok használhatják ezt a funkciót');
    }

    if (!body.newPassword) {
      throw new BadRequestException('Az új jelszó megadása kötelező');
    }

    await this.userService.adminChangePassword(id, body.newPassword);
    await this.auditService.logUpdate('User', id, { password: '***' }, { password: '***' }, req.user?.id);
    return { message: 'Jelszó sikeresen módosítva' };
  }

  @Delete(':id')
  @Permissions(Permission.USER_DELETE)
  async delete(@Param('id') id: string, @Request() req: any) {
    const user = await this.userService.findOne(id);
    await this.userService.delete(id);
    await this.auditService.logDelete('User', id, user, req.user?.id);
    return { message: 'Felhasználó sikeresen törölve' };
  }
}

