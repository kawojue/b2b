import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { AuthModule } from 'src/auth/auth.module'
import { WebhookModule } from 'src/webhook/webhook.module'
import { BusinessModule } from 'src/business/business.module'
import { CustomerModule } from 'src/customer/customer.module'
import { CardModule } from 'src/card/card.module'

@Module({
  imports: [
    AuthModule,
    CardModule,
    WebhookModule,
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
