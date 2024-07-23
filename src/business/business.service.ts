import { Response } from 'express'
import { Injectable } from '@nestjs/common'
import { StatusCodes } from 'enums/statusCodes'
import { PrismaService } from 'prisma/prisma.service'
import { RegisterBusinessDTO } from './dto/index.dto'
import { ResponseService } from 'libs/response.service'
import { InfiniteScrollDTO } from 'src/app/dto/pagination.dto'

@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly response: ResponseService,
  ) { }

  async register(res: Response, { sub }: ExpressUser, { name }: RegisterBusinessDTO) {
    const business = await this.prisma.business.create({
      data: {
        name: name,
        owner: { connect: { id: sub } }
      }
    })

    this.response.sendSuccess(res, StatusCodes.OK, { data: business })
  }

  async fetchBusinesses(
    res: Response,
    { sub }: ExpressUser,
    {
      page = 1,
      limit = 50,
      search = '',
      endDate = '',
      startDate = '',
    }: InfiniteScrollDTO
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

    const [businesses, total] = await this.prisma.$transaction([
      this.prisma.business.findMany({
        where: {
          ownerId: sub,
          createdAt: dateFilter,
          OR: [{ name: { contains: search, mode: 'insensitive' } }]
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.business.count({
        where: {
          ownerId: sub,
          createdAt: dateFilter,
          OR: [{ name: { contains: search, mode: 'insensitive' } }]
        },
      })
    ])

    const totalPage = Math.ceil(total / limit)
    const hasNext = page < totalPage
    const hasPrev = page > 1

    this.response.sendSuccess(res, StatusCodes.OK, {
      data: businesses,
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
