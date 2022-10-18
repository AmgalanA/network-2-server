import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { getCurrentTime } from 'src/utils/getCurrentTime';
import { sendMessageDto } from './dtos/send-message.dto';
import { ConversationModel } from './models/conversation/conversation.model';
import { MessageModel } from './models/message/message.model';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(ConversationModel)
    private conversationRepository: typeof ConversationModel,
    @InjectModel(MessageModel) private messageRepository: typeof MessageModel,
  ) {}

  async create(ids: number[]) {
    const candidate = await this.conversationRepository.findOne({
      where: {
        profileIds: { [Op.contains]: ids },
      },
    });

    if (candidate) return candidate;

    const conversation = await this.conversationRepository.create(ids);

    return conversation;
  }

  async getConversationById(id: number) {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      include: { all: true },
    });

    return conversation;
  }

  async sendMessage(dto: sendMessageDto) {
    const sentAt = getCurrentTime();

    const message = await this.messageRepository.create({ ...dto, sentAt });

    return message;
  }

  async getMessageById(id: number) {
    const message = await this.messageRepository.findOne({ where: { id } });

    if (!message) throw new BadRequestException(`No message with id: ${id}.`);

    return message;
  }

  async updateMessage({ id, text }: { id: number; text: string }) {
    const message = await this.getMessageById(id);

    message.text = text;

    return message.save();
  }

  async deleteMessage(id: number) {
    const message = await this.messageRepository.destroy({ where: { id } });

    if (!message) throw new BadRequestException(`No message with id: ${id}.`);

    return message;
  }
}
