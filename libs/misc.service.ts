import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { StatusCodes } from 'enums/statusCodes'
import { ResponseService } from './response.service'

@Injectable()
export class MiscService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly response: ResponseService,
    ) { }

    handleServerError(res: Response, err?: any, msg?: string) {
        console.error(err)
        return this.response.sendError(res, StatusCodes.InternalServerError, msg || err?.message || 'Something went wrong')
    }

    async generateAccessToken({ sub }: JwtPayload): Promise<string> {
        return await this.jwtService.signAsync({ sub }, {
            expiresIn: '30d',
            secret: process.env.JWT_SECRET,
        })
    }
}