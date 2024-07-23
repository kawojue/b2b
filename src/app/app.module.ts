import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { AuthModule } from 'src/auth/auth.module'
import { BusinessModule } from 'src/business/business.module'
import { CustomerModule } from 'src/customer/customer.module'

@Module({
  imports: [
    AuthModule,
    BusinessModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
  ],
})
export class AppModule { }
