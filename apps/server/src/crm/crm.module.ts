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
  ],
  providers: [
    AccountService,
    CampaignService,
    TicketService,
    OpportunityService,
    QuoteService,
    OrderService,
  ],
  exports: [OpportunityService, QuoteService, OrderService],
})
export class CrmModule {}
