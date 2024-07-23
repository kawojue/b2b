import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CardService } from './card.service'
import { CardController } from './card.controller'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { BitnobService } from 'libs/Bitnob/bitnob.service'

@Module({
  controllers: [CardController],
  providers: [
    CardService,
    JwtService,
    BitnobService,
    PrismaService,
    ResponseService,
  ],
})
export class CardModule { }
