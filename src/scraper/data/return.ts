interface ReturnDetail {
  endDate: string
  value: string
}

export interface CumulativeReturn {
  secId: string
  returns: ReturnDetail[]
}
