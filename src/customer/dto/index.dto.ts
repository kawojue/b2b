import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { titleText } from "helpers/transformer"
import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class RegisterCustomerDTO {
    @ApiProperty({
        example: 'Muyiwa'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => titleText(value))
    firstname: string

    @ApiProperty({
        example: 'Muyiwa'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => titleText(value))
    lastname: string
}