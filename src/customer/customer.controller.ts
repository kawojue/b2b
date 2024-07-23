import {
  Req,
  Get,
  Res,
  Body,
  Post,
  Param,
  Query,
  UseGuards,
  Controller,
} from '@nestjs/common'
import { Response } from 'express'
import { CustomerService } from './customer.service'
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard'
import { RegisterCustomerDTO } from './dto/index.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { InfiniteScrollDTO } from 'src/app/dto/pagination.dto'

@ApiBearerAuth()
@ApiTags('Customer')
@UseGuards(JwtAuthGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post('/create/:businessId')
  async create(
    @Res() res: Response,
    @Req() req: IRequest,
    @Body() body: RegisterCustomerDTO,
    @Param('businessId') businessId: string
  ) {
    await this.customerService.create(res, businessId, req.user, body)
  }

  @Get('/list/:businessId')
  async fetchCustomers(
    @Res() res: Response,
    @Req() req: IRequest,
    @Query() query: InfiniteScrollDTO,
    @Param('businessId') businessId: string
  ) {
    await this.customerService.fetchCustomers(res, businessId, req.user, query)
  }
}
