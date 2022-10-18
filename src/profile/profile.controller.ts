import {
  Body,
  Controller,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editProfileDto } from './dtos/edit-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put('edit')
  @UseInterceptors(FileInterceptor('file'))
  edit(
    @Body() dto: editProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.profileService.edit(dto, file);
  }

  @Patch('toggle-friends')
  toggleFriends(@Body() { fromId, toId }: { fromId: number; toId: number }) {
    return this.profileService.toggleFriends(fromId, toId);
  }

  @Patch('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Body() { id }: { id: number },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadImage(id, file);
  }

  @Patch('remove-image')
  @UseInterceptors(FileInterceptor('file'))
  removeImage(@Body() { id, url }: { id: number; url: string }) {
    return this.profileService.removeImage(id, url);
  }
}
