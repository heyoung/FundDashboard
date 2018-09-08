export interface FundData {
  name: string
  isin: string
  secId: string
  returns: { EndDate: string; Value: string }[]
}
