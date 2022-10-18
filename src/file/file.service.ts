import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { v4 } from 'uuid';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

export enum FileType {
  PROFILE_AVATAR = 'profile_avatar',
  POST_IMAGE = 'post-image',
  IMAGE = 'image',
}

@Injectable()
export class FileService {
  createFile(type: FileType, file: Express.Multer.File) {
    try {
      const fileExtension = file.originalname.split('.').pop();

      const fileName = v4() + '.' + fileExtension;

      const filePath = resolve(__dirname, '..', 'static', type);

      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }

      writeFileSync(resolve(filePath, fileName), file.buffer);

      return type + '/' + fileName;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
