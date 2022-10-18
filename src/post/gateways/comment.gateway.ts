import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { CommentService } from '../comment.service';
import { commentDto } from '../dtos/comment.dto';
import { PostService } from '../post.service';
import { CommentPaths } from './comment.paths';

@WebSocketGateway(80, { namespace: 'comment', cors: true })
export class CommentGateway {
  constructor(
    private commentService: CommentService,
    private postService: PostService,
  ) {}

  @WebSocketServer()
  server: Server;

  async getPost(@MessageBody() id: number) {
    const post = await this.postService.getPostById(id);

    this.server.emit(CommentPaths.GET_POST, post);
  }

  @SubscribeMessage(CommentPaths.TOGGLE_LIKE)
  async sendComment(@MessageBody() dto: commentDto) {
    await this.commentService.sendComment(dto);

    await this.getPost(+dto.postId);
  }

  @SubscribeMessage(CommentPaths.UPDATE_COMMENT)
  async updateComment(@MessageBody() dto: { commentId: number; text: string }) {
    const comment = await this.commentService.updateComment(dto);

    await this.getPost(comment.postId);
  }

  @SubscribeMessage(CommentPaths.DELETE_COMMENT)
  async deleteComment(@MessageBody() commentId: number) {
    const comment = await this.commentService.deleteComment(commentId);

    await this.getPost(comment.postId);
  }

  @SubscribeMessage(CommentPaths.TOGGLE_LIKE)
  async toggleLike(
    @MessageBody() dto: { commentId: number; profileId: number },
  ) {
    const comment = await this.commentService.toggleLikeComment(dto);

    await this.getPost(comment.postId);
  }

  @SubscribeMessage(CommentPaths.TOGGLE_POST_LIKE)
  async togglePostLike(
    @MessageBody() dto: { postId: number; profileId: number },
  ) {
    await this.postService.toggleLikePost(dto);

    await this.getPost(dto.postId);
  }
}
