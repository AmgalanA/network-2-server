import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createPostDto } from './dtos/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() dto: createPostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postService.create(dto, file);
  }
}
