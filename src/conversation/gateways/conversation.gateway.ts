import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConversationService } from '../conversation.service';
import { sendMessageDto } from '../dtos/send-message.dto';
import { ConversationPaths } from './conversation.paths';

@WebSocketGateway(80, { namespace: 'comment', cors: true })
export class ConversationGateway {
  constructor(private conversationService: ConversationService) {}

  @WebSocketServer()
  server: Server;

  async getConversation(@MessageBody() id: number) {
    const conversation = await this.conversationService.getConversationById(id);

    this.server.emit(ConversationPaths.GET_CONVERSATION, conversation);
  }

  @SubscribeMessage(ConversationPaths.SEND_MESSAGE)
  async sendMessage(@MessageBody() dto: sendMessageDto) {
    await this.conversationService.sendMessage(dto);

    await this.getConversation(dto.conversationId);
  }

  @SubscribeMessage(ConversationPaths.UPDATE_MESSAGE)
  async updateMessage(@MessageBody() dto: { id: number; text: string }) {
    const message = await this.conversationService.updateMessage(dto);

    await this.getConversation(message.conversationId);
  }

  @SubscribeMessage(ConversationPaths.DELETE_MESSAGE)
  async deleteMessage(
    @MessageBody()
    { id, conversationId }: { id: number; conversationId: number },
  ) {
    await this.conversationService.deleteMessage(id);

    await this.getConversation(conversationId);
  }
}
