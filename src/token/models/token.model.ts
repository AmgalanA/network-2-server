import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AuthModel } from 'src/auth/models/auth.model';

@Table({ tableName: 'token' })
export class TokenModel extends Model<TokenModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  refreshToken: string;

  @ForeignKey(() => AuthModel)
  @Column({ type: DataType.INTEGER })
  authId: number;
}
