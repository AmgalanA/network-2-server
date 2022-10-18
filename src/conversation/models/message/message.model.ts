import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profile/models/profile.model';
import { ConversationModel } from '../conversation/conversation.model';
import { messageCreatingAttrs } from './message.interface';

@Table({ tableName: 'message' })
export class MessageModel extends Model<MessageModel, messageCreatingAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @ForeignKey(() => ConversationModel)
  @Column({ type: DataType.INTEGER })
  conversationId: number;

  @ForeignKey(() => ProfileModel)
  @Column({ type: DataType.INTEGER })
  profileId: number;

  @BelongsTo(() => ProfileModel)
  profile: ProfileModel;

  @Column({ type: DataType.STRING })
  text: string;

  @Column({ type: DataType.STRING })
  sentAt: string;

  @ForeignKey(() => MessageModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  messageId?: number;

  @BelongsTo(() => MessageModel)
  message?: MessageModel;
}
