import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MiscService } from 'libs/misc.service'
import { CustomerService } from './customer.service'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { CustomerController } from './customer.controller'

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    JwtService,
    MiscService,
    PrismaService,
    ResponseService
  ],
})
export class CustomerModule { }
