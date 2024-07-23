import { v4 as uuidv4 } from 'uuid'
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CardParamDTO {
    @ApiProperty({
        example: uuidv4()
    })
    @IsString()
    @IsNotEmpty()
    cardId: string

    @ApiProperty({
        example: uuidv4()
    })
    @IsString()
    @IsNotEmpty()
    businessId: string

    @ApiProperty({
        example: uuidv4()
    })
    @IsString()
    @IsNotEmpty()
    customerId: string
}