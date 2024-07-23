import { Response } from 'express'
import { Injectable } from '@nestjs/common'
import { CardParamDTO } from './dto/card.dto'
import { StatusCodes } from 'enums/statusCodes'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { BitnobService } from 'libs/Bitnob/bitnob.service'

@Injectable()
export class CardService {
    private bitnob: BitnobService

    constructor(
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
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
            amount: 300,
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

    async removeCard(
        res: Response,
        {
            cardId,
            customerId,
            businessId,
        }: CardParamDTO,
        { sub }: ExpressUser,
    ) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId,
                customer: {
                    business: {
                        ownerId: sub,
                        id: businessId,
                    },
                    id: customerId,
                }
            }
        })

        if (!card) {
            return this.response.sendError(res, StatusCodes.NotFound, "Virtual Card not found")
        }

        await this.bitnob.terminateCard({ cardId: card.cardId })

        await this.prisma.card.delete({
            where: { id: cardId }
        })

        this.response.sendSuccess(res, StatusCodes.OK, {
            message: "Card removed"
        })
    }

    async freezeCard(
        res: Response,
        {
            cardId,
            customerId,
            businessId,
        }: CardParamDTO,
        { sub }: ExpressUser,
    ) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId,
                customer: {
                    business: {
                        ownerId: sub,
                        id: businessId,
                    },
                    id: customerId,
                }
            }
        })

        if (!card) {
            return this.response.sendError(res, StatusCodes.NotFound, "Virtual Card not found")
        }

        if (card.status !== "active") {
            return this.response.sendError(res, StatusCodes.UnprocessableEntity, "Card is Inactive")
        }

        const { data } = await this.bitnob.freezeCard({ cardId: card.cardId })

        const newCard = await this.prisma.card.update({
            where: { id: cardId },
            data: { status: data.status },
            select: {
                id: true,
                status: true,
                cardId: true,
                updatedAt: true,
            }
        })

        this.response.sendSuccess(res, StatusCodes.OK, { data: newCard })
    }

    async unfreezeCard(
        res: Response,
        {
            cardId,
            customerId,
            businessId,
        }: CardParamDTO,
        { sub }: ExpressUser,
    ) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId,
                customer: {
                    business: {
                        ownerId: sub,
                        id: businessId,
                    },
                    id: customerId,
                }
            }
        })

        if (!card) {
            return this.response.sendError(res, StatusCodes.NotFound, "Virtual Card not found")
        }

        if (card.status === "terminated") {
            return this.response.sendError(res, StatusCodes.UnprocessableEntity, "Card has been terminated")
        }

        if (card.status !== "frozen") {
            return this.response.sendError(res, StatusCodes.UnprocessableEntity, "Card is active")
        }

        const { data } = await this.bitnob.unfreezeCard({ cardId: card.cardId })

        const newCard = await this.prisma.card.update({
            where: { id: cardId },
            data: { status: data.status },
            select: {
                id: true,
                status: true,
                cardId: true,
                updatedAt: true,
            }
        })

        this.response.sendSuccess(res, StatusCodes.OK, { data: newCard })
    }

    async terminateCard(
        res: Response,
        {
            cardId,
            customerId,
            businessId,
        }: CardParamDTO,
        { sub }: ExpressUser,
    ) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId,
                customer: {
                    business: {
                        ownerId: sub,
                        id: businessId,
                    },
                    id: customerId,
                }
            }
        })

        if (!card) {
            return this.response.sendError(res, StatusCodes.NotFound, "Virtual Card not found")
        }

        await this.bitnob.terminateCard({ cardId: card.cardId }) // a webhook will be sent automatically.

        this.response.sendSuccess(res, StatusCodes.OK, {})
    }
}
