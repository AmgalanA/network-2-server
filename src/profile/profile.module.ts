import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from './models/profile.model';
import { ProfileGateway } from './gateways/profile.gateway';
import { FileModule } from 'src/file/file.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileGateway],
  imports: [SequelizeModule.forFeature([ProfileModel]), FileModule],
  exports: [ProfileService],
})
export class ProfileModule {}
