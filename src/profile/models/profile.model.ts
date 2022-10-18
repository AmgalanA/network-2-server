import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AuthModel } from 'src/auth/models/auth.model';
import { profileCreatingAttrs } from './profile.interface';

@Table({ tableName: 'profile' })
export class ProfileModel extends Model<ProfileModel, profileCreatingAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  lastSeen: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isOnline: boolean;

  @Column({ type: DataType.STRING, defaultValue: '' })
  status: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  images: string[];

  @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: [] })
  friends: number[];

  @Column({ type: DataType.STRING, defaultValue: '' })
  from: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  birthDate: string;

  @ForeignKey(() => AuthModel)
  @Column({ type: DataType.INTEGER })
  authId: number;

  @Column({ type: DataType.STRING, defaultValue: '' })
  avatarUrl: string;
}
