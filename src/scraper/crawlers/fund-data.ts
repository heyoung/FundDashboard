import request from 'request-promise-native'
import { Logger } from 'winston'
import { FundData } from '../../data/fund-data'
import { buildLogger } from '../../logging/logger-factory'
import { FundDataCrawlerException } from '../exceptions'

class FundDataCrawler {
  private logger: Logger

  constructor() {
    this.logger = buildLogger('FundDataCrawler')
  }

  public async getFundData(secid: string): Promise<FundData> {
    if (!secid) {
      this.logger.error('Invalid secid')
      return { name: '', isin: '', secId: '', returns: [] }
    }

    try {
      const cumReturn = await this.getCumulativeReturn(secid)
      const details = await this.getDetails(secid)

      this.logger.info(`Getting fund data for secid: ${secid}`)

      return {
        isin: details.isin,
        name: details.name,
        returns: cumReturn.returns,
        secId: secid
      }
    } catch (e) {
      if (e instanceof FundDataCrawlerException) {
        this.logger.error(`Error getting fund data for secid: ${secid}`)
      }
      return { name: '', isin: '', secId: '', returns: [] }
    }
  }

  private async getCumulativeReturn(
    secid: string
  ): Promise<{ returns: { EndDate: string; Value: string }[] }> {
    const uri = `https://lt.morningstar.com/api/rest.svc/timeseries_cumulativereturn/9vehuxllxs?currencyId=GBP&endDate=2018-08-31&frequency=weekly&id=${secid}&idType=Morningstar&outputType=json&restructureDateOptions=ignore&startDate=1900-01-01`

    try {
      const response = await request.get(uri, { json: true })

      return {
        returns:
          response.TimeSeries.Security[0].CumulativeReturnSeries[0]
            .HistoryDetail
      }
    } catch (e) {
      this.logger.error(`Error getting cumulative return for secid: ${secid}`)
      throw new FundDataCrawlerException()
    }
  }

  private async getDetails(
    secid: string
  ): Promise<{ name: string; isin: string }> {
    // idType defines ids as being morning star IDs i.e Sec IDs
    const uri = `https://lt.morningstar.com/api/rest.svc/9vehuxllxs/securities_details?ids=${secid}&idType=msid&viewIds=CompareAdditional&currencyId=GBP&languageId=en-GB&responseViewFormat=json`

    try {
      const response = await request.get(uri, { json: true })

      if (!response.length) {
        this.logger.error(`Fund details not found for secid: ${secid}`)
        return { name: '', isin: '' }
      }

      const details = response[0]

      return { name: details.Name, isin: details.Isin }
    } catch (e) {
      this.logger.error(`Error getting details for secid: ${secid}`)
      throw new FundDataCrawlerException()
    }
  }
}

export { FundDataCrawler }
