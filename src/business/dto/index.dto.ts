import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { titleText } from "helpers/transformer"
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

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

class PaginationBaseDTO {
    @ApiProperty({
        example: 1
    })
    @IsOptional()
    page?: number

    @ApiProperty({
        example: 72
    })
    @IsOptional()
    limit?: number
}

export class InfiniteScrollDTO extends PaginationBaseDTO {
    @ApiProperty({
        example: ' '
    })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    search?: string

    @ApiProperty({
        example: '2024-07-22T00:00:00.000Z',
        default: 0,
    })
    @IsOptional()
    startDate?: string

    @ApiProperty({
        example: new Date()
    })
    @IsOptional()
    endDate?: string
}