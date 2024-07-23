import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { titleText, toLowerCase } from "helpers/transformer"
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"

export class RegisterCustomerDTO {
    @ApiProperty({
        example: 'kawojue08@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => toLowerCase(value))
    email: string

    @ApiProperty({
        example: 'Raheem'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => titleText(value))
    firstname: string

    @ApiProperty({
        example: 'Kawojue'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => titleText(value))
    lastname: string
}