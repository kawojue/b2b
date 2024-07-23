import * as crypto from 'crypto'
import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { Request, Response } from 'express'
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

    private processing = false
    private requestQueue: Request[] = []

    async enqueueRequest(req: Request) {
        this.requestQueue.push(req)
        this.processQueue()
    }

    private async processQueue() {
        if (this.processing) {
            return
        }

        this.processing = true

        while (this.requestQueue.length > 0) {
            const req = this.requestQueue.shift()
            if (req) {
                await this.handleEvent(req)
            }
        }

        this.processing = false
    }

    async handleEvent(req: Request) {
        const body = req.body as VirtualCardEvent


        switch (body.event) {
            case 'virtualcard.created.success':
                const cardCreatedSuccessData = body.data as VirtualCardSuccessData
                await this.triggerWebhook(body.event, body.data.reference.split('_')[1], cardCreatedSuccessData)
                break
            case 'virtualcard.transaction.declined.terminated':
                const cardTerminationData = body.data as VirtualCardTerminationData
                const { customer: { businessId } } = await this.prisma.card.findUnique({
                    where: {
                        cardId: cardTerminationData.cardId,
                    },
                    select: {
                        customer: {
                            select: {
                                businessId: true
                            }
                        }
                    }
                })
                await this.triggerWebhook(body.event, businessId, cardTerminationData)
                break
            default:
                break
        }
    }

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
