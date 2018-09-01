import request from 'request-promise-native'
import { Logger, loggers } from 'winston'
import { FundData } from '../data/fund-data'
import { InvalidSecIdError } from './exceptions'

class Client {
  private logger: Logger

  constructor() {
    this.logger = loggers.get('Scraper')
  }

  public async getFundData(secId: string): Promise<FundData> {
    if (!secId) {
      throw new InvalidSecIdError()
    }

    const cumReturn = await this.getCumulativeReturn(secId)
    const details = await this.getDetails(secId)

    return {
      isin: details.isin,
      name: details.name,
      returns: cumReturn.returns,
      secId
    }
  }

  private async getCumulativeReturn(
    secId: string
  ): Promise<{ returns: { endDate: string; value: string }[] }> {
    const uri = `https://lt.morningstar.com/api/rest.svc/timeseries_cumulativereturn/9vehuxllxs?currencyId=GBP&endDate=2018-08-31&frequency=daily&id=${secId}&idType=Morningstar&outputType=json&restructureDateOptions=ignore&startDate=1900-01-01`

    const response = await request.get(uri, { json: true })

    return {
      returns:
        response.TimeSeries.Security[0].CumulativeReturnSeries[0].HistoryDetail
    }
  }

  private async getDetails(
    secId: string
  ): Promise<{ name: string; isin: string }> {
    // idType defines ids as being morning star IDs i.e Sec IDs
    const uri = `https://lt.morningstar.com/api/rest.svc/9vehuxllxs/securities_details?ids=${secId}&idType=msid&viewIds=CompareAdditional&currencyId=GBP&languageId=en-GB&responseViewFormat=json`

    const response = await request.get(uri, { json: true })

    if (!response.length) {
      this.logger.error(`Fund details not found. SecId: ${secId}`)
      return { name: '', isin: '' }
    }

    const details = response[0]

    return { name: details.Name, isin: details.Isin }
  }
}

export { Client }
