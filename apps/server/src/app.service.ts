import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Audit Institute ERP API - Üdvözöljük!';
  }
}
