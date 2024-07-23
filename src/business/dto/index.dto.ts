import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { titleText } from "helpers/transformer"
import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class RegisterBusinessDTO {
    @ApiProperty({
        example: 'Kawojue'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => titleText(value))
    name: string
}