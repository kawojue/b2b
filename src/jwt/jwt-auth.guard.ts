import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp()
        const request = ctx.getRequest()

        const result = (await super.canActivate(context)) as boolean
        if (!result) {
            return false
        }

        const access_token = request.headers.authorization?.split('Bearer ')[1]
        if (!access_token) return false

        try {
            const decoded = await this.jwtService.verifyAsync(access_token, {
                secret: process.env.JWT_SECRET!,
                ignoreExpiration: false,
            })

            const user = await this.prisma.user.findUnique({
                where: { id: decoded.sub }
            })

            if (!user || !user.refresh_token) return false

            request.user = decoded
            return true
        } catch (err) {
            console.error(err)
            throw new UnauthorizedException()
        }
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException()
        }
        return user
    }
}