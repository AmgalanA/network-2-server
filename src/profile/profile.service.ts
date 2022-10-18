import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileService, FileType } from 'src/file/file.service';
import { getCurrentTime } from 'src/utils/getCurrentTime';
import { createProfileDto } from './dtos/create-profile.dto';
import { editProfileDto } from './dtos/edit-profile.dto';
import { ProfileModel } from './models/profile.model';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileModel) private profileRepository: typeof ProfileModel,
    private fileService: FileService,
  ) {}

  async create(dto: createProfileDto) {
    const candidate = await this.profileRepository.findOne({
      where: { authId: dto.authId },
    });

    if (candidate) return candidate;

    const lastSeen = getCurrentTime();

    const profile = await this.profileRepository.create({ ...dto, lastSeen });

    return profile;
  }

  async byAuthId(authId: number) {
    const profile = await this.profileRepository.findOne({ where: { authId } });

    if (!profile)
      throw new BadRequestException(`No profile with auth id: ${authId}.`);

    return profile;
  }

  async byId(id: number) {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) throw new BadRequestException(`No profile with id: ${id}.`);

    return profile;
  }

  async edit(dto: editProfileDto, file?: Express.Multer.File) {
    const profile = await this.byId(dto.id);

    let avatarUrl = '';

    if (file) {
      avatarUrl = this.fileService.createFile(FileType.PROFILE_AVATAR, file);
    }

    profile.name = dto.name;
    profile.birthDate = dto.birthDate;
    profile.status = dto.status;
    profile.from = dto.from;
    profile.avatarUrl = avatarUrl;

    return profile.save();
  }

  async toggleFriends(fromId: number, toId: number) {
    const fromProfile = await this.byId(fromId);

    const toProfile = await this.byId(toId);

    if (fromProfile.friends.includes(toId)) {
      fromProfile.friends = fromProfile.friends.filter(
        (friendId) => friendId !== toId,
      );
      toProfile.friends = toProfile.friends.filter(
        (friendId) => friendId !== fromId,
      );
    } else {
      fromProfile.friends = [...fromProfile.friends, toId];
      toProfile.friends = [...toProfile.friends, fromId];
    }

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  }

  async uploadImage(id: number, file: Express.Multer.File) {
    const profile = await this.byId(id);

    const image = this.fileService.createFile(FileType.IMAGE, file);

    profile.images = [...profile.images, image];

    return profile.save();
  }

  async removeImage(id: number, url: string) {
    const profile = await this.byId(id);

    profile.images = profile.images.filter((profileImg) => profileImg !== url);

    return profile.save();
  }

  async toggleOnline(id: number) {
    const profile = await this.byId(id);

    if (profile.isOnline) {
      profile.isOnline = false;

      const lastSeen = getCurrentTime();

      profile.lastSeen = lastSeen;
    } else {
      profile.isOnline = true;
    }

    return profile;
  }
}
