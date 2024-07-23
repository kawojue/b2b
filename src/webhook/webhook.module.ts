import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/axios'
import { WebhookService } from './webhook.service'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { WebhookController } from './webhook.controller'

@Module({
  imports: [HttpModule],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    ResponseService,
    PrismaService,
    JwtService,
  ],
})
export class WebhookModule { }
