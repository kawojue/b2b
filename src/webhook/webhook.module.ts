import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/axios'
import { WebhookService } from './webhook.service'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { WebhookController } from './webhook.controller'
import { BitnobService } from 'libs/Bitnob/bitnob.service'

@Module({
  imports: [HttpModule],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    ResponseService,
    PrismaService,
    JwtService,
    BitnobService,
  ],
})
export class WebhookModule { }
