import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModel } from './models/auth.model';
import { ProfileModule } from 'src/profile/profile.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SequelizeModule.forFeature([AuthModel]),
    ProfileModule,
    TokenModule,
  ],
})
export class AuthModule {}
