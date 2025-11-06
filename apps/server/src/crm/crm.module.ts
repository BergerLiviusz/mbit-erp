import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  controllers: [AccountController, CampaignController, TicketController],
  providers: [AccountService, CampaignService, TicketService],
})
export class CrmModule {}
