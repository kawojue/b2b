import { IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"

class PaginationBaseDTO {
    @ApiProperty({
        example: 1,
        required: false,
    })
    @IsOptional()
    page?: number

    @ApiProperty({
        example: 72,
        required: false,
    })
    @IsOptional()
    limit?: number
}

export class InfiniteScrollDTO extends PaginationBaseDTO {
    @ApiProperty({
        example: ' ',
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    search?: string

    @ApiProperty({
        example: '2024-07-22T00:00:00.000Z',
        default: 0,
        required: false,
    })
    @IsOptional()
    startDate?: string

    @ApiProperty({
        example: new Date(),
        required: false,
    })
    @IsOptional()
    endDate?: string
}