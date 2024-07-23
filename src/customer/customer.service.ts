import { Response } from 'express'
import { StatusCodes } from 'enums/statusCodes'
import { PrismaService } from 'prisma/prisma.service'
import { RegisterCustomerDTO } from './dto/index.dto'
import { ResponseService } from 'libs/response.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InfiniteScrollDTO } from 'src/app/dto/pagination.dto'

@Injectable()
export class CustomerService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
    ) { }

    async create(
        res: Response,
        businessId: string,
        { sub }: ExpressUser,
        { firstname, lastname }: RegisterCustomerDTO,
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

        const customer = await this.prisma.customer.create({
            data: {
                firstname, lastname,
                business: { connect: { id: businessId } }
            }
        })

        this.response.sendSuccess(res, StatusCodes.OK, { data: customer })
    }

    async fetchCustomers(
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

        const [customers, total] = await this.prisma.$transaction([
            this.prisma.customer.findMany({
                where: {
                    business: {
                        id: businessId,
                        ownerId: sub,
                    },
                    OR: [
                        { firstname: { contains: search, mode: 'insensitive' } },
                        { lastname: { contains: search, mode: 'insensitive' } },
                    ],
                    createdAt: dateFilter,
                },
                skip: offset,
                take: limit,
                include: { business: true },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.customer.count({
                where: {
                    business: {
                        id: businessId,
                        ownerId: sub,
                    },
                    OR: [
                        { firstname: { contains: search, mode: 'insensitive' } },
                        { lastname: { contains: search, mode: 'insensitive' } },
                    ],
                    createdAt: dateFilter,
                }
            })
        ])

        const totalPage = Math.ceil(total / limit)
        const hasNext = page < totalPage
        const hasPrev = page > 1

        this.response.sendSuccess(res, StatusCodes.OK, {
            data: customers,
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
