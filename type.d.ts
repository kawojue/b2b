interface ExpressUser extends Express.User {
    sub: string
}

interface IRequest extends Request {
    user: ExpressUser
}

interface JwtPayload {
    sub: string
}

interface JwtDecoded extends JwtPayload {
    iat: number
    exp: number
}