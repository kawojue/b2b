import {
  Req,
  Res,
  Get,
  Post,
  Body,
  Controller,
  UseGuards,
  Query,
} from '@nestjs/common'
import { Response } from 'express'
import { BusinessService } from './business.service'
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { InfiniteScrollDTO, RegisterBusinessDTO } from './dto/index.dto'

@ApiBearerAuth()
@ApiTags("Business")
@Controller('business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) { }

  @Post('register')
  register(
    @Req() req: IRequest,
    @Res() res: Response,
    @Body() body: RegisterBusinessDTO
  ) {
    return this.businessService.register(res, req.user, body)
  }

  @Get('list')
  fetchBusinesses(
    @Req() req: IRequest,
    @Res() res: Response,
    @Query() query: InfiniteScrollDTO
  ) {
    return this.businessService.fetchBusinesses(res, req.user, query)
  }
}
