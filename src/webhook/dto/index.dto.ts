import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsUrl } from "class-validator"

export class RegisterWebhookDTO {
    @ApiProperty({
        example: 'https://payshiga.com'
    })
    @IsUrl()
    @IsNotEmpty()
    url: string
}