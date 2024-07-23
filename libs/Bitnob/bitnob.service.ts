import { Injectable } from "@nestjs/common"
import { Consumer } from './consumer.service'

@Injectable()
export class BitnobService {
    private consumer: Consumer

    constructor() {
        this.consumer = new Consumer('https://sandboxapi.bitnob.co/api/v1', process.env.BITNOT_API_KEY)
    }

    registerCardUser(data: UserCardRegistrationData) {
        return this.consumer.sendRequest<UserCardRegistrationResponse>('POST', '/virtualcards/registercarduser', data)
    }

    createCard(data: CardCreationData) {
        return this.consumer.sendRequest<CardCreationResponse>('POST', '/virtualcards/create', data)
    }

    freezeCard(param: CardParam) {
        return this.consumer.sendRequest<CardResponse>('POST', '/virtualcards/freeze', param)
    }

    unfreezeCard(param: CardParam) {
        return this.consumer.sendRequest<CardResponse>('POST', '/virtualcards/unfreeze', param)
    }

    terminateCard(param: CardParam) {
        return this.consumer.sendRequest('POST', '/virtualcards/terminate', param) as Promise<void>
    }

    fetchCard({ cardId }: CardParam) {
        return this.consumer.sendRequest<CardResponse>('GET', `/virtualcards/cards/${cardId}`)
    }
}