import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { getCurrentTime } from 'src/utils/getCurrentTime';
import { commentDto } from './dtos/comment.dto';

import { CommentModel } from './models/comment/comment.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(CommentModel) private commentRepository: typeof CommentModel,
  ) {}
  async getCommentById(commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment)
      throw new BadRequestException(`No comment with id: ${commentId}.`);

    return comment;
  }

  async sendComment(dto: commentDto) {
    const sentAt = getCurrentTime();

    const comment = await this.commentRepository.create({
      sentAt,
      senderId: +dto.senderId,
      postId: +dto.postId,
      text: dto.text,
    });

    return comment;
  }

  async updateComment({
    commentId,
    text,
  }: {
    commentId: number;
    text: string;
  }) {
    const comment = await this.getCommentById(commentId);

    comment.text = text;

    return comment.save();
  }

  async deleteComment(commentId: number) {
    const comment = await this.getCommentById(commentId);

    await comment.destroy();

    return comment;
  }

  async toggleLikeComment({
    commentId,
    profileId,
  }: {
    commentId: number;
    profileId: number;
  }) {
    const comment = await this.getCommentById(commentId);

    if (comment.likes.includes(profileId)) {
      comment.likes = comment.likes.filter((id) => id !== profileId);
    } else {
      comment.likes = [...comment.likes, profileId];
    }

    return comment.save();
  }
}
