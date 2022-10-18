import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { MessageModel } from '../message/message.model';
import { conversationCreatingAttrs } from './conversation.interface';

@Table({ tableName: 'conversation' })
export class ConversationModel extends Model<
  ConversationModel,
  conversationCreatingAttrs
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({ type: DataType.ARRAY(DataType.INTEGER), allowNull: false })
  profileIds: number[];

  @HasMany(() => MessageModel, {
    foreignKey: 'conversationId',
  })
  messages: MessageModel[];
}
