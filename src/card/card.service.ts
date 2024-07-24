import { Response } from 'express'
import { Injectable } from '@nestjs/common'
import { CardParamDTO } from './dto/card.dto'
import { StatusCodes } from 'enums/statusCodes'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { BitnobService } from 'libs/Bitnob/bitnob.service'
import { InfiniteScrollDTO } from 'src/app/dto/pagination.dto'

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

    async fetchCards(
        res: Response,
        businessId: string,
        { sub }: ExpressUser,
        {
            page = 1,
            limit = 50,
            search = '',
            endDate = '',
            startDate = '',
        }: InfiniteScrollDTO,
    ) {
        page = Number(page)
        limit = Number(limit)

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return this.response.sendError(res, StatusCodes.BadRequest, "Invalid pagination query")
        }

        const offset = (page - 1) * limit

        const dateFilter = {
            gte: startDate !== '' ? new Date(startDate) : new Date(0),
            lte: endDate !== '' ? new Date(endDate) : new Date(),
        }

        const [cards, total] = await Promise.all([
            this.prisma.card.findMany({
                where: {
                    createdAt: dateFilter,
                    OR: [
                        { customer: { email: { contains: search, mode: 'insensitive' } } },
                        { customer: { firstname: { contains: search, mode: 'insensitive' } } },
                    ],
                    customer: {
                        business: {
                            ownerId: sub,
                            id: businessId,
                        }
                    }
                },
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' },
                include: { customer: true, }
            }),
            this.prisma.card.count({
                where: {
                    createdAt: dateFilter,
                    OR: [
                        { customer: { email: { contains: search, mode: 'insensitive' } } },
                        { customer: { firstname: { contains: search, mode: 'insensitive' } } },
                    ],
                    customer: {
                        business: {
                            ownerId: sub,
                            id: businessId,
                        }
                    }
                },
            })
        ])

        const totalPage = Math.ceil(total / limit)
        const hasNext = page < totalPage
        const hasPrev = page > 1

        this.response.sendSuccess(res, StatusCodes.OK, {
            data: cards,
            metadata: {
                page,
                limit,
                total,
                totalPage,
                hasNext,
                hasPrev,
            }
        })
    }
}
