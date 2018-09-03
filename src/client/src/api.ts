import { FundData } from '../../data/fund-data'

export default {
  getByIsin: async (isin: string): Promise<FundData> => {
    const response = await fetch(`/api/v1/funds/${isin}`)
    return await response.json()
  }
}
