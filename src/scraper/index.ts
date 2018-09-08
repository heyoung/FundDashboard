import { FundDataManager } from '../data/data-manager'
import { Scraper } from './scraper'
; (async function main() {
  // const SEC_IDS: string[] = ['F00000PI4A']
  // const client: Client = new Client()
  const manager: FundDataManager = await FundDataManager.build()
  // const pendingWritePromises: Promise<any>[] = []
  // SEC_IDS.forEach(async id => {
  //   pendingWritePromises.push(
  //     client.getFundData(id).then(data => manager.save(data))
  //   )
  // })
  // await Promise.all(pendingWritePromises)
  // await manager.close()
  const scraper = new Scraper(manager)

  await scraper.scrape()
  await manager.close()
})()
