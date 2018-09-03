import { Db, MongoClient, UpdateWriteOpResult } from 'mongodb'
import { Logger } from 'winston'
import { buildLogger } from '../logging/logger-factory'
import { FundData } from './fund-data'
import config from './db.config'

const MONGO_CONNECTION_URL = 'mongodb://localhost:27017/fund-dashboard'

class FundDataManager {
  public static async build(): Promise<FundDataManager> {
    return new FundDataManager(
      await MongoClient.connect(
        MONGO_CONNECTION_URL,
        { useNewUrlParser: true }
      ),
      config.DB_NAME
    )
  }

  private db: Db
  private client: MongoClient
  private logger: Logger

  constructor(client: MongoClient, db: string) {
    this.db = client.db(db)
    this.client = client
    this.logger = buildLogger('FundDataManager')
  }

  public close(): Promise<void> {
    this.logger.info('Closing mongo client connection')
    return this.client.close()
  }

  public getByIsin(isin: string): Promise<FundData | null> {
    this.logger.info(`Getting fund data for isin: ${isin}`)
    return this.db.collection('funds').findOne({ isin })
  }

  public save(data: FundData): Promise<UpdateWriteOpResult> {
    this.logger.info(`Saving fund data: ${data.name}`)
    return this.db
      .collection('funds')
      .updateOne({ isin: data.isin }, { $set: data }, { upsert: true })
  }
}

export { FundDataManager }
