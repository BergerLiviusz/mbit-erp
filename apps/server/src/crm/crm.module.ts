import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountImportService } from './account-import.service';
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
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { DiscountRuleController } from './discount-rule.controller';
import { DiscountRuleService } from './discount-rule.service';
import { DiscountCalculationService } from './discount-calculation.service';
import { SalesFlowService } from './sales-flow.service';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { InvoiceStubController } from './invoice-stub.controller';
import { InvoiceStubService } from './invoice-stub.service';
import { CustomerInteractionController } from './customer-interaction.controller';
import { CustomerInteractionService } from './customer-interaction.service';
import { CrmMessageController } from './crm-message.controller';
import { CrmMessageService } from './crm-message.service';
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
    LeadController,
    DiscountRuleController,
    ShipmentController,
    InvoiceStubController,
    CustomerInteractionController,
    CrmMessageController,
  ],
  providers: [
    AccountService,
    AccountImportService,
    CampaignService,
    TicketService,
    OpportunityService,
    QuoteService,
    OrderService,
    InvoiceService,
    ChatService,
    LeadService,
    DiscountRuleService,
    DiscountCalculationService,
    SalesFlowService,
    ShipmentService,
    InvoiceStubService,
    CustomerInteractionService,
    CrmMessageService,
  ],
  exports: [
    OpportunityService,
    QuoteService,
    OrderService,
    InvoiceService,
    ChatService,
    SalesFlowService,
    DiscountCalculationService,
  ],
})
export class CrmModule {}
