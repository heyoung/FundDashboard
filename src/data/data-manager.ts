import { Db, MongoClient, UpdateWriteOpResult } from 'mongodb'
import { buildLogger } from '../logging/logger-factory'
import config from './db.config'
import { FundData } from './fund-data'

const MONGO_CONNECTION_URL = 'mongodb://localhost:27017/fund-dashboard'

const logger = buildLogger('FundDataManager')

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

  constructor(client: MongoClient, db: string) {
    this.db = client.db(db)
    this.client = client
  }

  public close(): Promise<void> {
    logger.info('Closing mongo client connection')
    return this.client.close()
  }

  public getByIsin(isin: string): Promise<FundData | null> {
    logger.info(`Getting fund data for isin: ${isin}`)
    return this.db.collection('funds').findOne({ isin })
  }

  public getAll(): Promise<FundData[]> {
    logger.info('Getting all fund data')
    return this.db
      .collection('funds')
      .find()
      .toArray()
  }

  public save(data: FundData): Promise<UpdateWriteOpResult> {
    logger.info(`Saving fund data: ${data.name}`)
    return this.db
      .collection('funds')
      .updateOne({ isin: data.isin }, { $set: data }, { upsert: true })
  }
}

export { FundDataManager }
