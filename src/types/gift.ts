export type TGift = {
    id: number,
    totalPoint: number,
    name: string,
    createdAt: string,
    updatedAt: string
}

export type TRedeemPointRequest = {
    userId: number,
    point: number,
    redeemGiftId: number
}

export type TRedeemGiftRequest = {
    totalPoint: number,
    name: string
}

export type TUpdateRedeemGiftRequest = {
    id: number,
    totalPoint: number,
    name: string
}