import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { generateTokensDto } from './dtos/generate-tokens.dto';
import { TokenModel } from './models/token.model';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokenModel) private tokenRepository: typeof TokenModel,
    private jwtService: JwtService,
  ) {}

  generateTokens(dto: generateTokensDto) {
    const accessToken = this.jwtService.sign(dto, {
      secret: process.env.ACCESS_SECRET || 'access_token',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(dto, {
      secret: process.env.REFRESH_SECRET || 'refresh_token',
      expiresIn: '24h',
    });

    return { accessToken, refreshToken };
  }

  async saveToken(authId: number, refreshToken: string) {
    const tokenFromDB = await this.tokenRepository.findOne({
      where: { authId },
    });

    if (tokenFromDB) {
      tokenFromDB.refreshToken = refreshToken;

      return tokenFromDB.save();
    }

    const token = await this.tokenRepository.create({ authId, refreshToken });

    return token;
  }

  async handleTokens(dto: generateTokensDto) {
    const tokens = this.generateTokens(dto);

    await this.saveToken(dto.authId, tokens.refreshToken);

    return tokens;
  }

  async getOne(refreshToken: string) {
    const token = await this.tokenRepository.findOne({
      where: { refreshToken },
    });

    if (!token) return null;

    return token;
  }

  async validateRefreshToken(refreshToken: string) {
    const tokenData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_SECRET || 'refresh_token',
    });

    if (!tokenData) return null;

    return tokenData;
  }
}
