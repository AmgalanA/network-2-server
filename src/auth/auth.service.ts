import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compare, hash } from 'bcryptjs';
import { ProfileService } from 'src/profile/profile.service';
import { TokenService } from 'src/token/token.service';

import { createAuthDto } from './dtos/create-auth.dto';
import { loginUserDto } from './dtos/login-user.dto';
import { AuthModel } from './models/auth.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthModel) private authRepository: typeof AuthModel,
    private profileService: ProfileService,
    private tokenService: TokenService,
  ) {}

  async register(dto: createAuthDto) {
    const candidate = await this.authRepository.findOne({
      where: { email: dto.email },
    });

    if (candidate) {
      throw new BadRequestException(
        `User with email: ${dto.email} already exists.`,
      );
    }

    const hashPassword = await hash(dto.password, 5);

    const user = await this.authRepository.create({
      email: dto.email,
      password: hashPassword,
    });

    const payload = {
      name: dto.name,
      authId: user.id,
    };

    const profile = await this.profileService.create(payload);

    const tokenPayload = {
      authId: user.id,
      email: user.email,
    };

    const tokens = await this.tokenService.handleTokens(tokenPayload);

    return { profile, tokens };
  }

  async login(dto: loginUserDto) {
    const user = await this.authRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException(
        `User with email: ${dto.email} does not exist.`,
      );
    }

    const isPassEquals = await compare(dto.password, user.password);

    if (!isPassEquals) {
      throw new BadRequestException(`Password is not correct.`);
    }

    const profile = await this.profileService.byAuthId(user.id);

    const tokenPayload = {
      authId: user.id,
      email: user.email,
    };

    const tokens = await this.tokenService.handleTokens(tokenPayload);

    return { profile, tokens };
  }

  async byId(id: number) {
    const user = await this.authRepository.findOne({
      where: { id },
      include: { all: true },
    });

    if (!user) {
      throw new BadRequestException(`User with id: ${id} does not exist.`);
    }

    return user;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException(`Not authorized.`);

    const tokenData = await this.tokenService.validateRefreshToken(
      refreshToken,
    );

    const tokenFromDB = await this.tokenService.getOne(refreshToken);

    if (!tokenData || !tokenFromDB)
      throw new UnauthorizedException(`Not authorized.`);

    const user = await this.byId(tokenFromDB.authId);

    const profile = await this.profileService.byAuthId(user.id);

    const tokenPayload = {
      authId: user.id,
      email: user.email,
    };

    const tokens = await this.tokenService.handleTokens(tokenPayload);

    return { profile, tokens };
  }
}
