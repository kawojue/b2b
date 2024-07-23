import { Module } from '@nestjs/common'
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
    PrismaService,
    ResponseService,
  ],
})
export class WebhookModule { }
