import queryString from 'query-string'
import { FundData } from '../../data/fund-data'

export default {
  getByIsin: async (isin: string): Promise<FundData> => {
    const response = await fetch(`/api/v1/funds/${isin}`)
    return await response.json()
  },

  getByName: async (name: string): Promise<FundData> => {
    const response = await fetch(
      `/api/v1/funds?${queryString.stringify({ name })}`
    )
    return response.json()
  },

  getFundNames: async (): Promise<string[]> => {
    const response = await fetch('/api/v1/funds/names')
    return (await response.json()).map((val: any) => val.name)
  }
}
