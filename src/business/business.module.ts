import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MiscService } from 'libs/misc.service'
import { BusinessService } from './business.service'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { BusinessController } from './business.controller'

@Module({
  controllers: [BusinessController],
  providers: [
    BusinessService,
    JwtService,
    MiscService,
    PrismaService,
    ResponseService
  ],
})
export class BusinessModule { }
