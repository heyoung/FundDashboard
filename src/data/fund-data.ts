interface ReturnDetail {
  endDate: string
  value: string
}

export interface FundData {
  secId: string
  isin: string
  name: string
  returns: { endDate: string; value: string }[]
}
