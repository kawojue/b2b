import {
    IsEmail,
    IsString,
    MaxLength,
    MinLength,
    IsNotEmpty,
} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { titleText, toLowerCase } from "helpers/transformer"

export class AuthDTO {
    @ApiProperty({
        example: 'kawojue08@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => toLowerCase(value))
    email: string

    @ApiProperty({
        example: 'Mypswd123'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(42)
    password: string
}

export class RegisterUserDTO extends AuthDTO {
    @ApiProperty({
        example: 'Raheem Kawojue'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => titleText(value))
    name: string
}