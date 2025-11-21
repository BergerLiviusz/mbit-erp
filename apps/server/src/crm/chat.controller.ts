import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ChatService,
  CreateChatRoomDto,
  CreateChatMessageDto,
  UpdateChatRoomDto,
} from './chat.service';
import { Permissions } from '../common/rbac/rbac.decorator';
import { Permission } from '../common/rbac/permission.enum';
import { RbacGuard } from '../common/rbac/rbac.guard';
import { AuditService } from '../common/audit/audit.service';

@Controller('crm/chat')
@UseGuards(RbacGuard)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private auditService: AuditService,
  ) {}

  @Get('rooms')
  @Permissions(Permission.CRM_VIEW)
  findAllRooms(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('accountId') accountId?: string,
    @Query('allapot') allapot?: string,
    @Query('userId') userId?: string,
  ) {
    return this.chatService.findAllRooms(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 50,
      {
        accountId,
        allapot,
        userId,
      },
    );
  }

  @Get('rooms/:id')
  @Permissions(Permission.CRM_VIEW)
  findRoom(@Param('id') id: string) {
    return this.chatService.findRoom(id);
  }

  @Post('rooms')
  @Permissions(Permission.CRM_CREATE)
  async createRoom(@Body() dto: CreateChatRoomDto, @Request() req: any) {
    const room = await this.chatService.createRoom(dto, req.user?.id);
    
    await this.auditService.logCreate(
      'ChatRoom',
      room.id,
      room,
      req.user?.id,
    );

    return room;
  }

  @Put('rooms/:id')
  @Permissions(Permission.CRM_EDIT)
  async updateRoom(
    @Param('id') id: string,
    @Body() dto: UpdateChatRoomDto,
    @Request() req: any,
  ) {
    const oldRoom = await this.chatService.findRoom(id);
    const updated = await this.chatService.updateRoom(id, dto);
    
    await this.auditService.logUpdate(
      'ChatRoom',
      id,
      oldRoom,
      updated,
      req.user?.id,
    );

    return updated;
  }

  @Post('rooms/:id/participants')
  @Permissions(Permission.CRM_EDIT)
  async addParticipant(
    @Param('id') id: string,
    @Body() body: { userId?: string; externalName?: string },
    @Request() req: any,
  ) {
    const participant = await this.chatService.addParticipant(
      id,
      body.userId,
      body.externalName,
    );
    
    await this.auditService.logCreate(
      'ChatParticipant',
      participant.id,
      participant,
      req.user?.id,
    );

    return participant;
  }

  @Delete('rooms/:id/participants')
  @Permissions(Permission.CRM_EDIT)
  async removeParticipant(
    @Param('id') id: string,
    @Body() body: { userId?: string; externalName?: string },
    @Request() req: any,
  ) {
    const participant = await this.chatService.removeParticipant(
      id,
      body.userId,
      body.externalName,
    );
    
    await this.auditService.logUpdate(
      'ChatParticipant',
      participant.id,
      participant,
      { ...participant, elhagyott: new Date() },
      req.user?.id,
    );

    return participant;
  }

  @Get('rooms/:id/messages')
  @Permissions(Permission.CRM_VIEW)
  async getMessages(@Param('id') id: string) {
    const room = await this.chatService.findRoom(id);
    return room.messages;
  }

  @Post('rooms/:id/messages')
  @Permissions(Permission.CRM_CREATE)
  async sendMessage(
    @Param('id') id: string,
    @Body() dto: CreateChatMessageDto,
    @Request() req: any,
  ) {
    const message = await this.chatService.sendMessage(id, dto, req.user?.id);
    
    await this.auditService.logCreate(
      'ChatMessage',
      message.id,
      message,
      req.user?.id,
    );

    return message;
  }

  @Post('rooms/:id/mark-read')
  @Permissions(Permission.CRM_VIEW)
  async markMessagesAsRead(@Param('id') id: string, @Request() req: any) {
    return this.chatService.markMessagesAsRead(id, req.user?.id);
  }

  @Get('rooms/:id/unread-count')
  @Permissions(Permission.CRM_VIEW)
  async getUnreadCount(@Param('id') id: string, @Request() req: any) {
    return this.chatService.getUnreadCount(id, req.user?.id);
  }

  @Post('rooms/:id/close')
  @Permissions(Permission.CRM_EDIT)
  async closeRoom(@Param('id') id: string, @Request() req: any) {
    const room = await this.chatService.closeRoom(id);
    
    await this.auditService.logUpdate(
      'ChatRoom',
      id,
      { allapot: 'NYITOTT' },
      { allapot: 'LEZART' },
      req.user?.id,
    );

    return room;
  }

  @Delete('rooms/:id')
  @Permissions(Permission.CRM_DELETE)
  async deleteRoom(@Param('id') id: string, @Request() req: any) {
    const oldRoom = await this.chatService.findRoom(id);
    await this.chatService.deleteRoom(id);
    
    await this.auditService.logDelete(
      'ChatRoom',
      id,
      oldRoom,
      req.user?.id,
    );

    return { message: 'Chat szoba törölve' };
  }
}

