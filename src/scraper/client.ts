import request from 'request-promise-native'
import { FundNotFoundError, InvalidSecIdError } from './exceptions'

interface FundDetails {
  name: string
}

interface ReturnDetail {
  endDate: string
  value: string
}

interface CumulativeReturn {
  id: string
  returns: ReturnDetail[]
}

class Client {
  public async getCumulativeReturn(secId: string): Promise<CumulativeReturn> {
    if (!secId) {
      throw new InvalidSecIdError()
    }

    const uri = `https://lt.morningstar.com/api/rest.svc/timeseries_cumulativereturn/9vehuxllxs?currencyId=GBP&endDate=2018-08-31&frequency=daily&id=${secId}&idType=Morningstar&outputType=json&restructureDateOptions=ignore&startDate=1900-01-01`

    const response = await request.get(uri, { json: true })

    return {
      id: response.TimeSeries.Security[0].Id,
      returns:
        response.TimeSeries.Security[0].CumulativeReturnSeries[0].HistoryDetail,
    }
  }

  public async getDetails(secId: string): Promise<FundDetails> {
    if (!secId) {
      throw new InvalidSecIdError()
    }

    // idType defines ids as being morning star IDs i.e Sec IDs
    const uri = `https://lt.morningstar.com/api/rest.svc/9vehuxllxs/securities_details?ids=${secId}&idType=msid&viewIds=CompareAdditional&currencyId=GBP&languageId=en-GB&responseViewFormat=json`

    try {
      const response = await request.get(uri, { json: true })

      if (!response.length) {
        throw new FundNotFoundError()
      }

      const details = response[0]

      return { name: details.name }
    } catch (e) {
      throw e
    }
  }
}

export { Client }
