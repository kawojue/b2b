import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { titleText } from "helpers/transformer"
import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class RegisterCustomerDTO {
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