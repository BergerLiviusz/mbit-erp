import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';

@Controller('crm/campaigns')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.campaignService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.campaignService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.campaignService.update(id, data);
  }
}
