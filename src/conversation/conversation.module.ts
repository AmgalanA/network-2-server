import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConversationModel } from './models/conversation/conversation.model';
import { MessageModel } from './models/message/message.model';
import { ConversationGateway } from './gateways/conversation.gateway';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, ConversationGateway],
  imports: [SequelizeModule.forFeature([ConversationModel, MessageModel])],
})
export class ConversationModule {}
