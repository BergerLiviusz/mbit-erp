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
import { SystemModule } from '../system/system.module';

@Module({
  imports: [SystemModule],
  controllers: [
    AccountController,
    CampaignController,
    TicketController,
    OpportunityController,
    QuoteController,
  ],
  providers: [
    AccountService,
    CampaignService,
    TicketService,
    OpportunityService,
    QuoteService,
  ],
  exports: [OpportunityService, QuoteService],
})
export class CrmModule {}
