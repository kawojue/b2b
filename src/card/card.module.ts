import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CardService } from './card.service'
import { MiscService } from 'libs/misc.service'
import { CardController } from './card.controller'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { BitnobService } from 'libs/Bitnob/bitnob.service'
import { WebhookService } from 'src/webhook/webhook.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  controllers: [CardController],
  providers: [
    CardService,
    JwtService,
    MiscService,
    BitnobService,
    PrismaService,
    WebhookService,
    ResponseService,
  ],
})
export class CardModule { }
