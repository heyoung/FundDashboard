import { FundDataManager } from '../data/data-manager'
import { Scraper } from './scraper'
; (async function main() {
  const manager: FundDataManager = await FundDataManager.build()

  const scraper = new Scraper(manager)

  await scraper.scrape()
  await manager.close()
})()
