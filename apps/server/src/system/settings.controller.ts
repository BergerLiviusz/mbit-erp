import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SystemSettingsService } from './settings.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { AuditService } from '../common/audit/audit.service';

@Controller('system/settings')
export class SystemSettingsController {
  constructor(
    private settingsService: SystemSettingsService,
    private auditService: AuditService,
  ) {}

  @Get()
  @Permissions(Permission.SYSTEM_SETTINGS)
  async getAll() {
    return await this.settingsService.getAll();
  }

  @Get('category/:category')
  @Permissions(Permission.SYSTEM_SETTINGS)
  async getByCategory(@Param('category') category: string) {
    return await this.settingsService.getAllByCategory(category);
  }

  @Get(':key')
  @Permissions(Permission.SYSTEM_SETTINGS)
  async get(@Param('key') key: string) {
    const value = await this.settingsService.get(key);
    return { kulcs: key, ertek: value };
  }

  @Post()
  @Permissions(Permission.SYSTEM_SETTINGS)
  async create(@Body() body: { kulcs: string; ertek: string; tipus: string; kategoria: string; leiras?: string }) {
    await this.settingsService.set(
      body.kulcs,
      body.ertek,
      body.kategoria,
      body.tipus,
      body.leiras,
    );
    await this.auditService.logCreate('SystemSetting', body.kulcs, body);
    return { message: 'Beállítás létrehozva' };
  }

  @Put(':key')
  @Permissions(Permission.SYSTEM_SETTINGS)
  async update(@Param('key') key: string, @Body() body: { ertek: string }) {
    const oldValue = await this.settingsService.get(key);
    await this.settingsService.set(key, body.ertek);
    await this.auditService.logUpdate('SystemSetting', key, { ertek: oldValue }, body);
    return { message: 'Beállítás frissítve' };
  }

  @Post('bulk')
  @Permissions(Permission.SYSTEM_SETTINGS)
  async updateMany(@Body() body: { settings: Array<{ kulcs: string; ertek: string }> }) {
    await this.settingsService.updateMany(body.settings);
    await this.auditService.logCreate('SystemSetting', 'bulk-update', body);
    return { message: 'Beállítások frissítve' };
  }

  @Delete(':key')
  @Permissions(Permission.SYSTEM_SETTINGS)
  async delete(@Param('key') key: string) {
    const oldValue = await this.settingsService.get(key);
    await this.settingsService.delete(key);
    await this.auditService.logDelete('SystemSetting', key, { ertek: oldValue });
    return { message: 'Beállítás törölve' };
  }

  @Post('initialize')
  @Permissions(Permission.SYSTEM_SETTINGS)
  async initializeDefaults() {
    await this.settingsService.initializeDefaults();
    return { message: 'Alapértelmezett beállítások inicializálva' };
  }
}
