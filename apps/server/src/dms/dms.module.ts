import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { OcrService } from './ocr.service';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService, OcrService],
})
export class DmsModule {}
