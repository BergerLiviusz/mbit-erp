import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Mbit ERP API - Üdvözöljük!';
  }
}
