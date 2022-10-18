import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenModel } from './models/token.model';
import { TokenService } from './token.service';

@Module({
  controllers: [],
  providers: [TokenService],
  imports: [SequelizeModule.forFeature([TokenModel]), JwtModule.register({})],
  exports: [TokenService],
})
export class TokenModule {}
