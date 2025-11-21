import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SystemModule } from '../system/system.module';
import { AuditModule } from '../common/audit/audit.module';

@Module({
  imports: [SystemModule, AuditModule],
  controllers: [
    AccountController,
    CampaignController,
    TicketController,
    OpportunityController,
    QuoteController,
    OrderController,
    InvoiceController,
    ChatController,
  ],
  providers: [
    AccountService,
    CampaignService,
    TicketService,
    OpportunityService,
    QuoteService,
    OrderService,
    InvoiceService,
    ChatService,
  ],
  exports: [OpportunityService, QuoteService, OrderService, InvoiceService, ChatService],
})
export class CrmModule {}
