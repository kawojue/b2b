import {
  Res,
  Req,
  Body,
  Post,
  HttpCode,
  Controller,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuthDTO, RegisterUserDTO } from './dto/index.dto'

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(201)
  @Post('/register')
  async register(@Body() body: RegisterUserDTO) {
    return await this.authService.register(body)
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() body: AuthDTO) {
    await this.authService.login(res, body)
  }

  @Post('refresh-token')
  async refreshAccessToken(@Res() res: Response, @Req() req: Request) {
    await this.authService.refreshAccessToken(req, res)
  }
}
