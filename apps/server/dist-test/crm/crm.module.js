"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmModule = void 0;
var common_1 = require("@nestjs/common");
var account_controller_1 = require("./account.controller");
var account_service_1 = require("./account.service");
var account_import_service_1 = require("./account-import.service");
var campaign_controller_1 = require("./campaign.controller");
var campaign_service_1 = require("./campaign.service");
var ticket_controller_1 = require("./ticket.controller");
var ticket_service_1 = require("./ticket.service");
var opportunity_controller_1 = require("./opportunity.controller");
var opportunity_service_1 = require("./opportunity.service");
var quote_controller_1 = require("./quote.controller");
var quote_service_1 = require("./quote.service");
var order_controller_1 = require("./order.controller");
var order_service_1 = require("./order.service");
var invoice_controller_1 = require("./invoice.controller");
var invoice_service_1 = require("./invoice.service");
var chat_controller_1 = require("./chat.controller");
var chat_service_1 = require("./chat.service");
var lead_controller_1 = require("./lead.controller");
var lead_service_1 = require("./lead.service");
var discount_rule_controller_1 = require("./discount-rule.controller");
var discount_rule_service_1 = require("./discount-rule.service");
var discount_calculation_service_1 = require("./discount-calculation.service");
var sales_flow_service_1 = require("./sales-flow.service");
var shipment_controller_1 = require("./shipment.controller");
var shipment_service_1 = require("./shipment.service");
var invoice_stub_controller_1 = require("./invoice-stub.controller");
var invoice_stub_service_1 = require("./invoice-stub.service");
var customer_interaction_controller_1 = require("./customer-interaction.controller");
var customer_interaction_service_1 = require("./customer-interaction.service");
var crm_message_controller_1 = require("./crm-message.controller");
var crm_message_service_1 = require("./crm-message.service");
var system_module_1 = require("../system/system.module");
var audit_module_1 = require("../common/audit/audit.module");
var CrmModule = /** @class */ (function () {
    function CrmModule() {
    }
    CrmModule = __decorate([
        (0, common_1.Module)({
            imports: [system_module_1.SystemModule, audit_module_1.AuditModule],
            controllers: [
                account_controller_1.AccountController,
                campaign_controller_1.CampaignController,
                ticket_controller_1.TicketController,
                opportunity_controller_1.OpportunityController,
                quote_controller_1.QuoteController,
                order_controller_1.OrderController,
                invoice_controller_1.InvoiceController,
                chat_controller_1.ChatController,
                lead_controller_1.LeadController,
                discount_rule_controller_1.DiscountRuleController,
                shipment_controller_1.ShipmentController,
                invoice_stub_controller_1.InvoiceStubController,
                customer_interaction_controller_1.CustomerInteractionController,
                crm_message_controller_1.CrmMessageController,
            ],
            providers: [
                account_service_1.AccountService,
                account_import_service_1.AccountImportService,
                campaign_service_1.CampaignService,
                ticket_service_1.TicketService,
                opportunity_service_1.OpportunityService,
                quote_service_1.QuoteService,
                order_service_1.OrderService,
                invoice_service_1.InvoiceService,
                chat_service_1.ChatService,
                lead_service_1.LeadService,
                discount_rule_service_1.DiscountRuleService,
                discount_calculation_service_1.DiscountCalculationService,
                sales_flow_service_1.SalesFlowService,
                shipment_service_1.ShipmentService,
                invoice_stub_service_1.InvoiceStubService,
                customer_interaction_service_1.CustomerInteractionService,
                crm_message_service_1.CrmMessageService,
            ],
            exports: [
                opportunity_service_1.OpportunityService,
                quote_service_1.QuoteService,
                order_service_1.OrderService,
                invoice_service_1.InvoiceService,
                chat_service_1.ChatService,
                sales_flow_service_1.SalesFlowService,
                discount_calculation_service_1.DiscountCalculationService,
            ],
        })
    ], CrmModule);
    return CrmModule;
}());
exports.CrmModule = CrmModule;
