export interface FundData {
  secId: string
  isin: string
  name: string
  returns: { EndDate: string; Value: string }[]
}
