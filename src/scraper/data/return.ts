interface ReturnDetail {
  endDate: string
  value: string
}

export interface CumulativeReturn {
  id: string
  returns: ReturnDetail[]
}
