import { IDType } from "@prisma/client"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { titleText, toLowerCase } from "helpers/transformer"
import {
    IsEmail,
    IsString,
    MaxLength,
    IsNotEmpty,
    IsPhoneNumber,
} from "class-validator"

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

    @ApiProperty({
        example: '+2348131911964'
    })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({
        example: 'Nigeria'
    })
    @Transform(({ value }) => titleText(value))
    country: string

    @ApiProperty({
        example: 'Lagos State'
    })
    @Transform(({ value }) => titleText(value))
    state: string

    @ApiProperty({
        example: 'Lagos'
    })
    @Transform(({ value }) => titleText(value))
    city: string

    @ApiProperty({
        example: 'Opp'
    })
    line1: string

    @ApiProperty({
        example: '27'
    })
    @IsString()
    houseNo: string

    @ApiProperty({
        enum: IDType
    })
    idType: IDType

    @ApiProperty({
        example: '2292497227'
    })
    idNumber: string

    @ApiProperty({
        example: '106101'
    })
    zipCode: string

    @ApiProperty({
        example: '249274972'
    })
    bvn?: string

    @ApiProperty({
        example: 'url..'
    })
    idImage?: string

    @ApiProperty({
        example: '' // Base64
    })
    userPhoto?: string

    @ApiProperty({
        example: '2003-09-10'
    })
    dob: string
}