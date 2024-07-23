import * as crypto from 'crypto'
import { Response } from 'express'
import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { StatusCodes } from 'enums/statusCodes'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class WebhookService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly response: ResponseService,
    ) { }

    async registerWebhook(
        url: string,
        res: Response,
        businessId: string,
        { sub }: ExpressUser,
    ) {
        const business = await this.prisma.business.findUnique({
            where: {
                ownerId: sub,
                id: businessId,
            }
        })

        if (!business) {
            throw new NotFoundException("Business not found")
        }

        const webhook = await this.prisma.webhook.upsert({
            where: { businessId },
            create: {
                url,
                business: { connect: { id: businessId } },
            },
            update: { url },
        })

        this.response.sendSuccess(res, StatusCodes.OK, { data: webhook })
    }

    async triggerWebhook(event: string, businessId: string, data: any) {
        const webhook = await this.prisma.webhook.findUnique({
            where: { businessId },
        })

        if (webhook && webhook.url) {
            const secret = webhook.businessId // not a secret though
            const hash = crypto.createHmac('sha256', secret)
                .update(JSON.stringify(data))
                .digest('hex')

            await lastValueFrom(this.httpService.post(webhook.url, { event, data }, {
                headers: {
                    'webhook-signature': hash
                }
            }))
        }
    }
}
