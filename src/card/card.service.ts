import { Response } from 'express'
import { Injectable } from '@nestjs/common'
import { MiscService } from 'libs/misc.service'
import { StatusCodes } from 'enums/statusCodes'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { BitnobService } from 'libs/Bitnob/bitnob.service'
import { WebhookService } from 'src/webhook/webhook.service'

@Injectable()
export class CardService {
    private bitnob: BitnobService

    constructor(
        private readonly misc: MiscService,
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
        private readonly webhookService: WebhookService,
    ) {
        this.bitnob = new BitnobService()
    }

    async createCard(
        res: Response,
        businessId: string,
        customerId: string,
        { sub }: ExpressUser,
    ) {
        const customer = await this.prisma.customer.findUnique({
            where: {
                business: {
                    ownerId: sub,
                    id: businessId,
                },
                id: customerId,
            }
        })

        if (!customer) {
            return this.response.sendError(res, StatusCodes.NotFound, "Customer not found")
        }

        const ref = `${Date.now()}_${businessId}`

        const { data } = await this.bitnob.createCard({
            amount: 0,
            reference: ref,
            cardBrand: 'visa',
            cardType: 'virtual',
            lastName: customer.lastname,
            customerEmail: customer.email,
            firstName: customer.firstname,
        })

        const card = await this.prisma.card.create({
            data: {
                reference: data.reference,
                customer: { connect: { id: customerId } }
            },
            select: {
                id: true,
                status: true,
                reference: true,
                customerId: true,
            }
        })

        this.response.sendSuccess(res, StatusCodes.OK, { data: card })
    }


}
