import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { DocumentService } from './document.service';

@Controller('dms/documents')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string
  ) {
    return this.documentService.findAll(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      search
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.documentService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.documentService.update(id, data);
  }
}
