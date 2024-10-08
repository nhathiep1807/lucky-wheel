export type TCreateNewUserResquest = {
    phoneNumber: string,
    name: string
}

export type TRankingRequest = {
    fromDate: string,
    toDate: string
}
export type TCountPointRequest = {
    userId: number,
    itemId: number
}