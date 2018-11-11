export interface FundData {
  name: string
  isin: string
  secId: string
  returns: Array<{ EndDate: string; Value: string }>
}
