import {
    Injectable,
    NotFoundException,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { MiscService } from 'libs/misc.service'
import { StatusCodes } from 'enums/statusCodes'
import { PrismaService } from 'prisma/prisma.service'
import { ResponseService } from 'libs/response.service'
import { AuthDTO, RegisterUserDTO } from './dto/index.dto'
import { EncryptionService } from 'libs/encryption.service'

@Injectable()
export class AuthService {
    private isProduction: boolean
    constructor(
        private readonly misc: MiscService,
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
        private readonly encryption: EncryptionService,
    ) {
        this.isProduction = process.env.NODE_ENV === "production"
    }

    async register({ email, name, password }: RegisterUserDTO) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        })

        if (user) {
            throw new ConflictException("There is no user associated with this email")
        }

        password = await this.encryption.hash(password)

        await this.prisma.user.create({
            data: { email, password, name }
        })

        return { message: "Account created successfully" }
    }

    async login(res: Response, { email, password }: AuthDTO) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new NotFoundException("There is no user associated with this email")
        }

        const isMatch = await this.encryption.compare(password, user.password)
        if (!isMatch) {
            throw new UnauthorizedException("Incorrect Password")
        }

        const payload = { sub: user.id } as JwtPayload

        const access_token = this.misc.generateAccessToken(payload)

        this.response.sendSuccess(res, StatusCodes.OK, {
            access_token, data: {
                name: user.name,
                email: user.email,
            }
        })
    }
}
