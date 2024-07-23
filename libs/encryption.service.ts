import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EncryptionService {

    async hash(password: string, saltRounds: number = 10): Promise<string> {
        const salt = await bcrypt.genSalt(saltRounds)
        return await bcrypt.hash(password, salt)
    }

    async compare(plain: string | Buffer, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plain, hashed)
    }
}