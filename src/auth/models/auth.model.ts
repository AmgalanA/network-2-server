import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profile/models/profile.model';
import { authCreatingAttrs } from './auth.inteface';

@Table({ tableName: 'auth' })
export class AuthModel extends Model<AuthModel, authCreatingAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.INTEGER })
  password: string;

  @ForeignKey(() => ProfileModel)
  @Column({ type: DataType.INTEGER })
  profileId: number;
}
