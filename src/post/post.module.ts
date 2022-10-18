import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostModel } from './models/post/post.model';
import { CommentModel } from './models/comment/comment.model';
import { CommentGateway } from './gateways/comment.gateway';
import { FileModule } from 'src/file/file.module';
import { CommentService } from './comment.service';

@Module({
  controllers: [PostController],
  providers: [PostService, CommentService, CommentGateway],
  imports: [SequelizeModule.forFeature([PostModel, CommentModel]), FileModule],
})
export class PostModule {}
