type CardStatus = 'active' | 'frozen'
type CardType = 'virtual' | 'giftcard'
type CardBrand = 'visa' | 'mastercard'

interface CardParam {
    cardId: string
}

interface CardCreationData {
    cardBrand?: CardBrand
    cardType?: CardType
    amount?: number
    reference: string
    firstName?: string
    lastName?: string
    customerEmail?: string
}

interface CardCreationResponse {
    status: boolean
    message: string
    data: {
        id: string
        createdAt: string
        updatedAt: string
        cardType: string
        cardBrand: string
        cardUserId: string
        reference: string
        createdStatus: string
        customerId: string | null
    }
}

interface BillingAddress {
    city: string
    street: string
    zipCode: string
    countryCode: string
    country: string
}

interface CardData {
    id: string
    createdAt: string
    updatedAt: string
    balance: number
    cardNumber: string
    last4: string
    cardName: string
    cardType: string
    cardBrand: string
    cvv2: string
    expiry: string
    valid: string
    status: CardStatus
    reference: string
    createdStatus: string
    customerId: string | null
    billingAddress: BillingAddress
    customerEmail: string
}

interface CardResponse {
    status: boolean
    message: string
    data: CardData
}

interface VirtualCardEvent {
    event: 'virtualcard.transaction.declined.terminated' | 'virtualcard.created.success'
    data: VirtualCardTerminationData | VirtualCardSuccessData
}

interface VirtualCardTerminationData {
    cardId: string
    reason: string
    companyId: string
    reference: string
    balanceBeforeTermination: number
}

interface VirtualCardSuccessData {
    id: string
    status: string
    companyId: string
    reference: string
    createdStatus: string
}

interface UserCardRegistrationResponse {
    status: boolean
    message: string
    data: {
        id: string
        createdAt: string
        updatedAt: string
        customerEmail: string
        firstName: string
        idNumber: string
        idType: string
        lastName: string
        phoneNumber: string
        userPhoto: string
        customerId: string
        line1: string
        city: string
        state: string
        zipCode: string
        country: string
        houseNumber: string
        dateOfBirth: string
        idImage: string
        cardBrand: string
        kycPassed: boolean
    }
}