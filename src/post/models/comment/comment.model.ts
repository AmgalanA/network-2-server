import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profile/models/profile.model';
import { PostModel } from '../post/post.model';
import { commentCreatingAttrs } from './comment.interface';

@Table({ tableName: 'comment' })
export class CommentModel extends Model<CommentModel, commentCreatingAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  text: string;

  @Column({ type: DataType.STRING })
  sentAt: string;

  @ForeignKey(() => ProfileModel)
  @Column({ type: DataType.INTEGER })
  senderId: number;

  @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: [] })
  likes: number[];

  @ForeignKey(() => PostModel)
  @Column({ type: DataType.INTEGER })
  postId: number;
}
