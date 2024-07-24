import * as crypto from 'crypto'
import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { Request, Response } from 'express'
import { StatusCodes } from 'enums/statusCodes'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { BitnobService } from 'libs/Bitnob/bitnob.service'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class WebhookService {
    constructor(
        private readonly bitnot: BitnobService,
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
        const body = req.body

        switch (body.event) {
            case 'virtualcard.created.success':
                const cardCreatedSuccessData = body.data as VirtualCardSuccessData
                const ref = cardCreatedSuccessData.reference

                const { data: card } = await this.bitnot.fetchCard({ cardId: cardCreatedSuccessData.id })

                await Promise.all([
                    this.prisma.card.update({
                        where: { reference: cardCreatedSuccessData.reference },
                        data: {
                            cvv: card.id,
                            status: card.status,
                            balance: card.balance,
                            last4: card.last4,
                            cardBrand: card.cardBrand,
                            cardName: card.cardName,
                            cardNumber: card.cardNumber,
                            reference: card.reference,
                            valid: card.valid,
                            cardType: card.cardType,
                            expiry: card.expiry,
                            cardId: card.id,
                            billingAddress: card.billingAddress as any,
                        }
                    }),
                    this.triggerWebhook(body.event, ref.split('_')[1], cardCreatedSuccessData)
                ])
                break
            case 'virtualcard.transaction.declined.terminated':
                const cardTerminationData = body.data as VirtualCardTerminationData
                const [{ customer: { businessId } }] = await this.prisma.$transaction([
                    this.prisma.card.findUnique({
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
                    }),
                    this.prisma.card.update({
                        where: {
                            cardId: cardTerminationData.cardId,
                        },
                        data: { status: 'terminated' }
                    })
                ])

                await this.triggerWebhook(body.event, businessId, cardTerminationData)
                break
            case 'virtualcard.user.kyc.success':
            case 'virtualcard.user.kyc.failed':
                const kycData = body.data as VirtualCardKyc
                const customer = await this.prisma.customer.findFirst({
                    where: { email: kycData.customerEmail }
                })
                await this.prisma.customer.update({
                    where: { id: customer.id },
                    data: { kycPassed: kycData.kycPassed }
                })
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
