import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { FileService, FileType } from 'src/file/file.service';
import { getCurrentTime } from 'src/utils/getCurrentTime';
import { createPostDto } from './dtos/create-post.dto';
import { PostModel } from './models/post/post.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel) private postRepository: typeof PostModel,
    private fileService: FileService,
  ) {}

  async create(dto: createPostDto, file?: Express.Multer.File) {
    let imageUrl = '';

    if (file) {
      imageUrl = this.fileService.createFile(FileType.POST_IMAGE, file);
    }

    const sentAt = getCurrentTime();

    const post = await this.postRepository.create({
      senderId: +dto.senderId,
      imageUrl,
      sentAt,
      text: dto.text,
    });

    return post;
  }

  async getPostById(postId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      include: { all: true },
    });

    if (!post) throw new BadRequestException(`No post with id: ${postId}.`);

    return post;
  }

  async bySenderId(senderId: number) {
    const posts = await this.postRepository.findAll({
      where: { senderId },
      include: { all: true },
    });

    return posts;
  }

  async toggleLikePost({
    postId,
    profileId,
  }: {
    postId: number;
    profileId: number;
  }) {
    const post = await this.getPostById(postId);

    if (post.likes.includes(profileId)) {
      post.likes = post.likes.filter((id) => id !== profileId);
    } else {
      post.likes = [...post.likes, profileId];
    }

    return post.save();
  }
}
