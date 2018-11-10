import request from 'request-promise-native'
import { buildLogger } from '../../logging/build-logger'

const ENDPOINT =
  'https://www.fidelity.co.uk/product/securities/service/funds/search-by-substring-with-filters-optimised'

const logger = buildLogger('IsinListCrawler')

class IsinListCrawler {
  public async getFunds(fundProvider: string): Promise<string[]> {
    if (!fundProvider) {
      logger.error('No fund provider')
      return []
    }

    let response

    try {
      response = await request.post({
        form: {
          appliedFilters: `*/INVESTMENT_COMPANY/NAME|${fundProvider}`,
          maxResults: 1000,
          start: 1
        },
        json: true,
        url: ENDPOINT
      })
    } catch (e) {
      logger.error(`Error getting ISINs for provider: ${fundProvider}`)
      return []
    }

    if (!response.FundList || !response.FundList.funds) {
      logger.error(`Cannot get ISINs for provider: ${fundProvider}`)
      return []
    }

    logger.info(`Getting ISINs for provider: ${fundProvider}`)

    const funds = response.FundList.funds

    const isins = funds.map((fund: any) => fund.isin)

    logger.info(`Retrieved ${isins.length} ISINs for provider: ${fundProvider}`)

    if (isins.length !== response.FundList.totalNumberOfResults) {
      logger.warn(`Did not retrieve all ISINs for provider: ${fundProvider}`)
    }

    return isins
  }
}

export { IsinListCrawler }
