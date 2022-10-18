import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ProfileService } from '../profile.service';
import { ProfilePaths } from './profile.paths';

@WebSocketGateway(80, { namespace: 'profile', cors: true })
export class ProfileGateway {
  constructor(private profileService: ProfileService) {}

  @WebSocketServer()
  server: Server;

  async getProfile(@MessageBody() id: number) {
    const profile = await this.profileService.byId(id);

    this.server.emit(ProfilePaths.GET_PROFILE, profile);
  }

  @SubscribeMessage(ProfilePaths.TOGGLE_ONLINE)
  async toggleOnline(@MessageBody() id: number) {
    await this.profileService.toggleOnline(id);

    await this.getProfile(id);
  }
}
