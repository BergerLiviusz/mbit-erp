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
} from '@nestjs/common';
import {
  ModelAnalysisService,
  CreateCostModelDto,
  UpdateCostModelDto,
  CreateQuantityModelDto,
  UpdateQuantityModelDto,
  RunModelDto,
} from './model-analysis.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('controlling/models')
@UseGuards(RbacGuard)
export class ModelAnalysisController {
  constructor(
    private modelAnalysisService: ModelAnalysisService,
    private auditService: AuditService,
  ) {}

  // Cost Models
  @Get('cost')
  @Permissions(Permission.REPORT_VIEW)
  findAllCostModels(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('aktiv') aktiv?: string,
    @Query('tipus') tipus?: string,
  ) {
    return this.modelAnalysisService.findAllCostModels(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
        tipus,
      },
    );
  }

  @Get('cost/:id')
  @Permissions(Permission.REPORT_VIEW)
  findCostModel(@Param('id') id: string) {
    return this.modelAnalysisService.findCostModel(id);
  }

  @Post('cost')
  @Permissions(Permission.REPORT_CREATE)
  async createCostModel(@Body() dto: CreateCostModelDto, @Request() req: any) {
    const model = await this.modelAnalysisService.createCostModel(dto);
    
    await this.auditService.logCreate(
      'CostModel',
      model.id,
      model,
      req.user?.id,
    );

    return model;
  }

  @Put('cost/:id')
  @Permissions(Permission.REPORT_EDIT)
  async updateCostModel(
    @Param('id') id: string,
    @Body() dto: UpdateCostModelDto,
    @Request() req: any,
  ) {
    const oldModel = await this.modelAnalysisService.findCostModel(id);
    const updated = await this.modelAnalysisService.updateCostModel(id, dto);
    
    await this.auditService.logUpdate(
      'CostModel',
      id,
      oldModel,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Post('cost/:id/run')
  @Permissions(Permission.REPORT_VIEW)
  runCostModel(@Param('id') id: string, @Body() dto: RunModelDto) {
    return this.modelAnalysisService.runCostModel(id, dto);
  }

  @Delete('cost/:id')
  @Permissions(Permission.REPORT_DELETE)
  async deleteCostModel(@Param('id') id: string, @Request() req: any) {
    const oldModel = await this.modelAnalysisService.findCostModel(id);
    await this.modelAnalysisService.deleteCostModel(id);
    
    await this.auditService.logDelete(
      'CostModel',
      id,
      oldModel,
      req.user?.id,
    );

    return { message: 'Költségmodell törölve' };
  }

  // Quantity Models
  @Get('quantity')
  @Permissions(Permission.REPORT_VIEW)
  findAllQuantityModels(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('aktiv') aktiv?: string,
  ) {
    return this.modelAnalysisService.findAllQuantityModels(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
      },
    );
  }

  @Get('quantity/:id')
  @Permissions(Permission.REPORT_VIEW)
  findQuantityModel(@Param('id') id: string) {
    return this.modelAnalysisService.findQuantityModel(id);
  }

  @Post('quantity')
  @Permissions(Permission.REPORT_CREATE)
  async createQuantityModel(@Body() dto: CreateQuantityModelDto, @Request() req: any) {
    const model = await this.modelAnalysisService.createQuantityModel(dto);
    
    await this.auditService.logCreate(
      'QuantityModel',
      model.id,
      model,
      req.user?.id,
    );

    return model;
  }

  @Put('quantity/:id')
  @Permissions(Permission.REPORT_EDIT)
  async updateQuantityModel(
    @Param('id') id: string,
    @Body() dto: UpdateQuantityModelDto,
    @Request() req: any,
  ) {
    const oldModel = await this.modelAnalysisService.findQuantityModel(id);
    const updated = await this.modelAnalysisService.updateQuantityModel(id, dto);
    
    await this.auditService.logUpdate(
      'QuantityModel',
      id,
      oldModel,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Post('quantity/:id/run')
  @Permissions(Permission.REPORT_VIEW)
  runQuantityModel(@Param('id') id: string, @Body() dto: RunModelDto) {
    return this.modelAnalysisService.runQuantityModel(id, dto);
  }

  @Delete('quantity/:id')
  @Permissions(Permission.REPORT_DELETE)
  async deleteQuantityModel(@Param('id') id: string, @Request() req: any) {
    const oldModel = await this.modelAnalysisService.findQuantityModel(id);
    await this.modelAnalysisService.deleteQuantityModel(id);
    
    await this.auditService.logDelete(
      'QuantityModel',
      id,
      oldModel,
      req.user?.id,
    );

    return { message: 'Mennyiségi modell törölve' };
  }
}

