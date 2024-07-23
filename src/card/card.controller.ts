import {
  Res,
  Req,
  Post,
  Param,
  UseGuards,
  Controller,
} from '@nestjs/common'
import { Response } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { CardService } from './card.service'
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard'

@ApiTags("Card")
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
}
