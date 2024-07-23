import {
  Res,
  Req,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common'
import { Response } from 'express'
import { CardService } from './card.service'
import { CardParamDTO } from './dto/card.dto'
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags("Card")
@ApiBearerAuth()
@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @Post('/create/:businessId/:customerId')
  async createCard(
    @Res() res: Response,
    @Req() req: IRequest,
    @Param('businessId') businessId: string,
    @Param('customerId') customerId: string,
  ) {
    await this.cardService.createCard(res, businessId, customerId, req.user)
  }

  @Delete('remove')
  async removeCard(
    @Res() res: Response,
    @Req() req: IRequest,
    @Body() body: CardParamDTO
  ) {
    await this.cardService.removeCard(res, body, req.user)
  }

  @Post('freeze')
  async freezeCard(
    @Res() res: Response,
    @Req() req: IRequest,
    @Body() body: CardParamDTO
  ) {
    await this.cardService.freezeCard(res, body, req.user)
  }

  @Post('unfreeze')
  async unfreezeCard(
    @Res() res: Response,
    @Req() req: IRequest,
    @Body() body: CardParamDTO
  ) {
    await this.cardService.unfreezeCard(res, body, req.user)
  }

  @Patch('terminate')
  async terminateCard(
    @Res() res: Response,
    @Req() req: IRequest,
    @Body() body: CardParamDTO
  ) {
    await this.cardService.terminateCard(res, body, req.user)
  }
}
