import { FundDataManager } from '../data/data-manager'
import { FundDataCrawler } from './crawlers/fund-data'
import { FundProviderCrawler } from './crawlers/fund-provider'
import { IsinListCrawler } from './crawlers/isin-list'
import { SecidListCrawler } from './crawlers/secid-list'

class Scraper {
  private fundDataCrawler: FundDataCrawler
  private fundProviderCrawler: FundProviderCrawler
  private isinListCrawler: IsinListCrawler
  private secidListCrawler: SecidListCrawler

  private fundDataManager: FundDataManager

  constructor(fundDataManager: FundDataManager) {
    this.fundDataCrawler = new FundDataCrawler()
    this.fundProviderCrawler = new FundProviderCrawler()
    this.isinListCrawler = new IsinListCrawler()
    this.secidListCrawler = new SecidListCrawler()

    this.fundDataManager = fundDataManager
  }

  public async scrape() {
    const fundProviders = await this.fundProviderCrawler.getFundProviders()

    const pendingPromises = []

    for (const provider of fundProviders) {
      const isins = await this.isinListCrawler.getFunds(provider)

      await this.sleep(2000)

      for (const isin of isins) {
        pendingPromises.push(this.saveData(isin))
      }
    }

    return Promise.all(pendingPromises)
  }

  private async saveData(isin: string) {
    const secId = await this.secidListCrawler.getSecid(isin)

    await this.sleep(5000)

    if (!secId.length) {
      return
    }

    const data = await this.fundDataCrawler.getFundData(secId)

    if (data.secId && data.isin && data.returns.length) {
      await this.fundDataManager.save(data)
    }

    return
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export { Scraper }
