import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { MiscService } from 'libs/misc.service'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { JwtStrategy } from 'src/jwt/jwt.strategy'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { EncryptionService } from 'libs/encryption.service'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    MiscService,
    PrismaService,
    ResponseService,
    EncryptionService,
  ],
})
export class AuthModule { }
