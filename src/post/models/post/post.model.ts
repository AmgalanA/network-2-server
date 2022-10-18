import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profile/models/profile.model';
import { CommentModel } from '../comment/comment.model';
import { postCreatingAttrs } from './post.interface';

@Table({ tableName: 'post' })
export class PostModel extends Model<PostModel, postCreatingAttrs> {
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
  imageUrl?: string;

  @Column({ type: DataType.STRING })
  sentAt: string;

  @ForeignKey(() => ProfileModel)
  @Column({ type: DataType.INTEGER })
  senderId: number;

  @HasMany(() => CommentModel, {
    foreignKey: 'postId',
  })
  comments: CommentModel[];

  @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: [] })
  likes: number[];
}
