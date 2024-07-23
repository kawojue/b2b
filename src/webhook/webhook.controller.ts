import {
  Req,
  Res,
  Body,
  Post,
  Param,
  UseGuards,
  Controller,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common'
import * as crypto from 'crypto'
import { Request, Response } from 'express'
import { WebhookService } from './webhook.service'
import { RegisterWebhookDTO } from './dto/index.dto'
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags("Webhook")
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('register/:businessId')
  async registerWebhook(
    @Res() res: Response,
    @Req() req: IRequest,
    @Body() { url }: RegisterWebhookDTO,
    @Param('businessId') businessId: string
  ) {
    await this.webhookService.registerWebhook(url, res, businessId, req.user)
  }

  @Post()
  async receiveWebhook(@Req() req: Request) {
    if (!req.body || !req.body?.event || !req.body?.data) {
      throw new BadRequestException('Invalid request body received')
    }

    const bitnobSignature = req.headers['x-bitnob-signature']
    const hashedSignature = crypto.createHmac('sha512', process.env.BITNOB_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex')

    if (bitnobSignature !== hashedSignature) {
      throw new UnauthorizedException("Invalid signature received")
    }

    try {
      await this.webhookService.enqueueRequest(req)
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException()
    }
  }
}
